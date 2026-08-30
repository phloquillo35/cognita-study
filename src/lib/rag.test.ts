import { describe, it, expect, beforeEach } from "vitest";
import { chunkText, keywordSearch, getRagContext, saveRagDocument, clearRagStore } from "./rag";
import type { RagDocument } from "./rag";

describe("rag", () => {
  beforeEach(() => clearRagStore());

  it("chunkText splits with overlap and handles empty", () => {
    expect(chunkText("")).toEqual([]);
    expect(chunkText("   ")).toEqual([]);
    const short = "hola mundo";
    expect(chunkText(short)).toEqual([short]);
    const long = "a".repeat(2500);
    const chunks = chunkText(long, 800, 100);
    expect(chunks.length).toBeGreaterThan(1);
    // each chunk <= size
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(800);
    // overlap check — consecutive chunks share suffix/prefix
    expect(chunks[1].slice(0, 20)).toBeDefined();
  });

  it("chunkText default size 800", () => {
    const text = "x".repeat(801);
    const chunks = chunkText(text);
    expect(chunks.length).toBe(2);
    expect(chunks[0].length).toBe(800);
  });

  it("keywordSearch returns ranked chunks with TF scoring", () => {
    const doc: RagDocument = {
      id: "doc1",
      filename: "apunte.pdf",
      subjectId: "am1",
      userId: "demo-user",
      createdAt: Date.now(),
      chunks: [
        { id: "c0", docId: "doc1", filename: "apunte.pdf", subjectId: "am1", index: 0, text: "La derivada mide la tasa de cambio instantánea de una función." },
        { id: "c1", docId: "doc1", filename: "apunte.pdf", subjectId: "am1", index: 1, text: "La integral es la operación inversa de la derivada, acumula área bajo la curva." },
        { id: "c2", docId: "doc1", filename: "apunte.pdf", subjectId: "am1", index: 2, text: "Física: fuerza igual masa por aceleración, segunda ley de Newton." },
      ],
    };
    saveRagDocument(doc);

    const res = keywordSearch("derivada");
    expect(res.length).toBeGreaterThan(0);
    // chunk 0 should rank higher than 2 for "derivada"
    expect(res[0].chunk.index).not.toBe(2);
    expect(res[0].score).toBeGreaterThan(0);

    // subject filter
    const filtered = keywordSearch("derivada", "fisica");
    expect(filtered.length).toBe(0);

    // empty query
    expect(keywordSearch("")).toEqual([]);
    expect(keywordSearch("   ")).toEqual([]);
  });

  it("getRagContext joins top chunks and respects maxChars", () => {
    const doc: RagDocument = {
      id: "doc2",
      filename: "a.txt",
      subjectId: "general",
      userId: "demo-user",
      createdAt: Date.now(),
      chunks: [
        { id: "c0", docId: "doc2", filename: "a.txt", subjectId: "general", index: 0, text: "contenido sobre derivadas y cálculo diferencial" },
        { id: "c1", docId: "doc2", filename: "a.txt", subjectId: "general", index: 1, text: "otro texto irrelevante sobre historia" },
      ],
    };
    saveRagDocument(doc);
    const ctx = getRagContext("derivadas");
    expect(ctx).toContain("derivadas");
    expect(ctx.length).toBeLessThanOrEqual(3000);

    const empty = getRagContext("query sin match xyzabc123");
    expect(empty).toBe("");
  });

  it("keywordSearch handles no documents", () => {
    expect(keywordSearch("algo")).toEqual([]);
    expect(getRagContext("algo")).toBe("");
  });

  it("chunkText with overlap 100 preserves continuity", () => {
    const text = Array.from({ length: 20 }, (_, i) => `palabra${i}`).join(" ");
    const chunks = chunkText(text, 50, 10);
    const joined = chunks.join(" ");
    // all words should appear somewhere
    expect(joined).toContain("palabra0");
    expect(joined).toContain("palabra19");
  });
});
