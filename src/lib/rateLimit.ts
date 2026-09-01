// Centralized rate-limit — Map fallback + Upstash Redis optional
// Compatible Vercel serverless (Map = best-effort) vs local dev.
// If UPSTASH_REDIS_REST_URL + TOKEN exist → use Upstash INCR + EXPIRE (persistent across instances)
// Otherwise fallback to in-memory Map with console.warn once.

type HitsEntry = number[];

const hits = new Map<string, HitsEntry>();
let warned = false;

function warnFallbackOnce(): void {
  if (!warned) {
    warned = true;
    console.warn(
      "[rateLimit] Upstash not configured (UPSTASH_REDIS_REST_URL missing), using in-memory Map fallback — no persiste en serverless"
    );
  }
}

function mapIsRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}

async function upstashIsRateLimited(
  url: string,
  token: string,
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean | null> {
  // Upstash REST: POST /INCR/<key> and EXPIRE <key> <seconds>
  // Use fetch directly — no extra dep needed
  const base = url.replace(/\/$/, "");
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const incrRes = await fetch(`${base}/INCR/${encodeURIComponent(key)}`, {
      method: "POST",
      headers,
    });
    if (!incrRes.ok) return null;
    const incrJson = (await incrRes.json()) as { result?: number };
    const count = typeof incrJson.result === "number" ? incrJson.result : 0;

    if (count === 1) {
      const ttlSec = Math.ceil(windowMs / 1000);
      // fire-and-forget EXPIRE (best-effort)
      await fetch(`${base}/EXPIRE/${encodeURIComponent(key)}/${ttlSec}`, {
        method: "POST",
        headers,
      }).catch(() => {});
    }

    return count > limit;
  } catch {
    return null;
  }
}

/**
 * Centralized rate-limit check.
 * @param ip - client IP (x-forwarded-for first entry)
 * @param route - logical route name e.g. "tutor", "generate", "rag-upload", "rag-search"
 * @param limit - max requests per window
 * @param windowMs - sliding window in ms
 * @returns true if rate-limited (should return 429), false otherwise
 */
export async function isRateLimited(
  ip: string,
  route: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const key = `ratelimit:${route}:${ip}`;
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    const res = await upstashIsRateLimited(upstashUrl, upstashToken, key, limit, windowMs);
    if (res !== null) return res;
    // Upstash failed → fallback to Map (warn once)
    warnFallbackOnce();
    return mapIsRateLimited(key, limit, windowMs);
  }

  if (upstashUrl && !upstashToken) {
    // misconfigured — warn and fallback
    warnFallbackOnce();
    return mapIsRateLimited(key, limit, windowMs);
  }

  warnFallbackOnce();
  return mapIsRateLimited(key, limit, windowMs);
}

// Test helper — clear in-memory hits (useful for unit/curl tests)
export function clearRateLimitStore(): void {
  hits.clear();
  warned = false;
}

// For direct Map inspection in tests
export function _getHitsMap(): Map<string, HitsEntry> {
  return hits;
}
