// v2 Loop6 2026-08-30 — PWA staleWhileRevalidate + cache versioning (?v=2)
// Bump CACHE_NAME to cognita-v2: old caches (v1) are purged in activate.
// - staleWhileRevalidate for /_next/static (cache-first + background update)
// - staleWhileRevalidate for /api/ GET with 60s cache (network-first but serve stale while revalidating)
// - version query ?v=2 for cache-busting (appended to precached URLs)
// - old caches purged: activate deletes any key !== CACHE_NAME && !== STATIC_CACHE

const VERSION = "v2";
const VERSION_QUERY = `?v=${VERSION}`;
const CACHE_NAME = "cognita-v2";
const STATIC_CACHE = "cognita-static-v2";
const OFFLINE_PAGE = "/offline";
const API_CACHE_MAX_AGE_MS = 60_000; // 60s for /api/ GET staleWhileRevalidate

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      // cache.addAll es "todo o nada": si alguna entrada falla, no se cachea nada.
      // Solo listamos rutas que SÍ existen. Añadimos ?v=2 para cache-busting versionado.
      cache
        .addAll([OFFLINE_PAGE, "/", "/manifest.json"].map((u) => `${u}${VERSION_QUERY}`))
        .catch(() =>
          cache.addAll([OFFLINE_PAGE, "/", "/manifest.json"]).catch(() => {})
        )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // /api/ — staleWhileRevalidate with 60s maxAge (serve stale while revalidating, fallback networkFirst)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAME, API_CACHE_MAX_AGE_MS));
    return;
  }

  // Static assets — staleWhileRevalidate (faster repeat loads, background update)
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  event.respondWith(networkFirst(request));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept as alternative strategy for future static cache use
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === "navigate") {
      const offlinePage =
        (await caches.match(`${OFFLINE_PAGE}${VERSION_QUERY}`)) ||
        (await caches.match(OFFLINE_PAGE));
      if (offlinePage) return offlinePage;
    }

    return new Response("Offline", { status: 503 });
  }
}

// staleWhileRevalidate: return cached immediately if present, fetch in background to update.
// For /api/ we enforce maxAge (60s) — if cached is older than maxAge, try network first.
async function staleWhileRevalidate(request, cacheName, maxAgeMs) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchAndCache = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    if (maxAgeMs) {
      const dateHeader = cached.headers.get("date");
      if (dateHeader) {
        const age = Date.now() - new Date(dateHeader).getTime();
        if (age > maxAgeMs) {
          const networkResponse = await fetchAndCache;
          if (networkResponse) return networkResponse;
          // network failed → serve stale
          return cached;
        }
      }
    }
    // serve stale immediately, revalidate in background
    fetchAndCache.catch(() => {});
    return cached;
  }

  const networkResponse = await fetchAndCache;
  if (networkResponse) return networkResponse;

  // no cache and network failed
  if (request.mode === "navigate") {
    const offlinePage =
      (await caches.match(`${OFFLINE_PAGE}${VERSION_QUERY}`)) ||
      (await caches.match(OFFLINE_PAGE));
    if (offlinePage) return offlinePage;
  }

  return new Response("Offline", { status: 503 });
}
