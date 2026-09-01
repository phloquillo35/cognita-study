import { NextRequest } from "next/server";
import { keywordSearch, getRagContext } from "@/lib/rag";
import { isRateLimited } from "@/lib/rateLimit";



export async function GET(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "127.0.0.1";
    if (await isRateLimited(ip, "rag-search", 30, 60_000)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const subjectId = searchParams.get("subjectId")?.trim() || undefined;
    const topK = Math.min(Math.max(Number(searchParams.get("topK") ?? 4), 1), 10);

    if (!q) {
      return new Response(JSON.stringify({ error: "Missing query param ?q=" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (q.length > 500) {
      return new Response(JSON.stringify({ error: "Query too long (max 500)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = keywordSearch(q, subjectId, topK);
    const context = getRagContext(q, subjectId, 4000);

    return new Response(
      JSON.stringify({
        query: q,
        subjectId: subjectId ?? null,
        count: results.length,
        results: results.map((r) => ({
          filename: r.chunk.filename,
          subjectId: r.chunk.subjectId,
          index: r.chunk.index,
          score: r.score,
          text: r.chunk.text,
        })),
        context,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("rag search error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
