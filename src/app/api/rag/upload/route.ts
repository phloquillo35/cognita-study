import { NextRequest } from "next/server";
import { chunkText, saveRagDocument, RAG_MAX_FILE_BYTES } from "@/lib/rag";
import type { RagDocument, RagChunk } from "@/lib/rag";
import { isRateLimited } from "@/lib/rateLimit";



async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());

  if (name.endsWith(".pdf")) {
    // pdf-parse v2: PDFParse with data buffer
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buf });
    try {
      const result = await parser.getText();
      return result.text ?? "";
    } finally {
      // pdf-parse v2 recommends destroy
      try {
        await parser.destroy();
      } catch {
        // ignore
      }
    }
  }

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer: buf });
    return result.value ?? "";
  }

  // txt or fallback — treat as utf8 text
  return buf.toString("utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "127.0.0.1";
    if (await isRateLimited(ip, "rag-upload", 12, 60_000)) {
      return new Response(JSON.stringify({ error: "Too many requests, try again later" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const subjectId = (formData.get("subjectId") as string) || "general";
    const userId = (formData.get("userId") as string) || "demo-user";

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "file is required (multipart field 'file')" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (file.size > RAG_MAX_FILE_BYTES) {
      return new Response(JSON.stringify({ error: "File exceeds 10MB limit" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      });
    }

    const allowed = [".pdf", ".docx", ".txt"];
    const lower = file.name.toLowerCase();
    const extOk = allowed.some((ext) => lower.endsWith(ext));
    if (!extOk) {
      return new Response(JSON.stringify({ error: "Allowed extensions: .pdf, .docx, .txt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let text: string;
    try {
      text = await extractText(file);
    } catch (e) {
      console.error("rag upload parse error:", e);
      return new Response(JSON.stringify({ error: "Failed to parse file", details: String(e) }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cleaned = text.trim();
    if (!cleaned) {
      return new Response(JSON.stringify({ error: "No text extracted from file" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chunksRaw = chunkText(cleaned, 800, 100);
    const docId = crypto.randomUUID();
    const chunks: RagChunk[] = chunksRaw.map((c, i) => ({
      id: `${docId}-${i}`,
      docId,
      filename: file.name,
      subjectId,
      index: i,
      text: c,
    }));

    const doc: RagDocument = {
      id: docId,
      filename: file.name,
      subjectId,
      userId,
      chunks,
      createdAt: Date.now(),
    };

    saveRagDocument(doc);

    // Optional: persist as Note with tags ["rag"] if DB available — best-effort, no await blocking
    // In-memory is source of truth for search; Note is backup for listing. No migration needed.
    try {
      const { getPrisma } = await import("@/lib/db");
      const prisma = await getPrisma();
      if (prisma) {
        prisma.note
          .create({
            data: {
              userId,
              subjectId,
              title: `RAG: ${file.name}`,
              content: chunksRaw.slice(0, 8).join("\n\n---\n\n").slice(0, 8000),
              tags: ["rag", subjectId],
            },
          })
          .catch(() => {});
      }
    } catch {
      // prisma not available or DB down — ignore, in-memory still works
    }

    return new Response(
      JSON.stringify({
        id: docId,
        filename: file.name,
        subjectId,
        chunks: chunks.length,
        preview: chunks[0]?.text.slice(0, 200) ?? "",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("rag upload error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
