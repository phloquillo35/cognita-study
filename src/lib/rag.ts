// RAG básico — chunking + keyword TF search (embeddings opcional)
// Persistencia v1: in-memory global Map (best-effort serverless) + fallback Note no requiere migración.
// Decisión documentada: evitar migración Prisma bloqueante; RagDocument se guarda como chunks en memoria
// y opcionalmente como Note con tags ["rag"] si DB disponible (no crítico para search).

export const RAG_CHUNK_SIZE = 800;
export const RAG_CHUNK_OVERLAP = 100;
export const RAG_MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
export const RAG_TOP_K = 4;

export interface RagChunk {
  id: string;
  docId: string;
  filename: string;
  subjectId: string;
  index: number;
  text: string;
}

export interface RagDocument {
  id: string;
  filename: string;
  subjectId: string;
  userId: string;
  chunks: RagChunk[];
  createdAt: number;
}

// --- chunking puro ---

export function chunkText(text: string, size = RAG_CHUNK_SIZE, overlap = RAG_CHUNK_OVERLAP): string[] {
  const clean = text.trim();
  if (!clean) return [];
  if (clean.length <= size) return [clean];
  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + size, clean.length);
    const slice = clean.slice(start, end).trim();
    if (slice) chunks.push(slice);
    if (end >= clean.length) break;
    start = end - overlap;
    if (start < 0) start = 0;
  }
  return chunks;
}

// --- tokenize + TF scoring ---

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9áéíóúñüàèìòùâêîôûäëïöüç]+/i)
    .filter((t) => t.length >= 2);
}

function scoreChunk(queryTokens: string[], chunkTextLower: string, chunkTokens: string[]): number {
  // TF: count occurrences of each query token in chunk
  let score = 0;
  const freq = new Map<string, number>();
  for (const t of chunkTokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  for (const q of queryTokens) {
    const f = freq.get(q) ?? 0;
    if (f > 0) score += f;
    // bonus for phrase contiguous
    if (chunkTextLower.includes(q) && q.length >= 3) score += 0.5;
  }
  // bonus si múltiples tokens del query aparecen
  const matched = queryTokens.filter((q) => freq.has(q)).length;
  if (matched > 1) score += matched * 0.3;
  return score;
}

export interface SearchResult {
  chunk: RagChunk;
  score: number;
}

// global in-memory store — survives hot reload via globalThis
declare global {
  var __cognita_rag_store: Map<string, RagDocument> | undefined;
}

function getStore(): Map<string, RagDocument> {
  if (!globalThis.__cognita_rag_store) {
    globalThis.__cognita_rag_store = new Map<string, RagDocument>();
  }
  return globalThis.__cognita_rag_store;
}

export function saveRagDocument(doc: RagDocument): void {
  getStore().set(doc.id, doc);
}

export function getRagDocuments(): RagDocument[] {
  return Array.from(getStore().values());
}

export function clearRagStore(): void {
  getStore().clear();
}

export function keywordSearch(query: string, subjectId?: string, topK = RAG_TOP_K): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const queryTokens = tokenize(q);
  if (queryTokens.length === 0) return [];

  const docs = getRagDocuments();
  const candidates: SearchResult[] = [];

  for (const doc of docs) {
    if (subjectId && doc.subjectId !== subjectId && subjectId !== "all") continue;
    for (const chunk of doc.chunks) {
      const lower = chunk.text.toLowerCase();
      const tokens = tokenize(lower);
      const score = scoreChunk(queryTokens, lower, tokens);
      if (score > 0) candidates.push({ chunk, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, topK);
}

export function getRagContext(query: string, subjectId?: string, maxChars = 3000): string {
  const results = keywordSearch(query, subjectId, RAG_TOP_K);
  if (results.length === 0) return "";
  let acc = "";
  for (const r of results) {
    const entry = `[${r.chunk.filename} #${r.chunk.index + 1}] ${r.chunk.text}`;
    if (acc.length + entry.length + 2 > maxChars) break;
    acc += (acc ? "\n\n" : "") + entry;
  }
  return acc;
}

// optional embeddings — only if OPENAI_API_KEY present, not used in v1 keyword flow
export async function embedIfAvailable(texts: string[]): Promise<number[][] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    // use fetch directly to avoid extra dep; fallback to keyword if fails
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "text-embedding-3-small", input: texts }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data: { embedding: number[] }[] };
    return json.data.map((d) => d.embedding);
  } catch {
    return null;
  }
}
