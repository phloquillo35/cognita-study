/**
 * Helper para modo híbrido: DB (Prisma) + fallback localStorage.
 * Detecta si /api/sync está en modo ok, y provee wrapper para fetch con fallback.
 */

export type SyncStatus = "idle" | "syncing" | "fallback" | "error";

let cachedAvailable: boolean | null = null;
let cachedAt = 0;
const CACHE_TTL = 30_000;

export async function isDbAvailable(): Promise<boolean> {
  if (cachedAvailable !== null && Date.now() - cachedAt < CACHE_TTL) return cachedAvailable;
  try {
    const r = await fetch("/api/sync", { cache: "no-store" });
    const j = await r.json();
    cachedAvailable = j.status === "ok";
    cachedAt = Date.now();
    return cachedAvailable;
  } catch {
    cachedAvailable = false;
    cachedAt = Date.now();
    return false;
  }
}

export function clearDbAvailableCache() {
  cachedAvailable = null;
}

export async function withFallback<T>(apiFn: () => Promise<T>, fallbackValue: T): Promise<{ data: T; fallback: boolean }> {
  try {
    const data = await apiFn();
    return { data, fallback: false };
  } catch {
    return { data: fallbackValue, fallback: true };
  }
}

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<{ data: T; fallback: boolean }> {
  try {
    const res = await fetch(url, init);
    const json = await res.json();
    if (json.fallback) return { data: json.data ?? json, fallback: true };
    if (res.headers.get("X-Fallback") === "localStorage") return { data: json.data ?? json, fallback: true };
    return { data: json as T, fallback: false };
  } catch {
    return { data: null as unknown as T, fallback: true };
  }
}
