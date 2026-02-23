/* ══════════════════════════════════════════════
   StreamFlix — sw.js (Service Worker / PWA)
   Caches assets for offline use
   ══════════════════════════════════════════════ */

const CACHE_NAME = 'streamflix-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/style.css',
  '/app.js',
  '/auth.js',
  '/manifest.json',
];

/* ── Install: pre-cache shell ── */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ── Activate: clean old caches ── */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ── Fetch: cache-first for assets, network-first for API ── */
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET and chrome-extension requests
  if (e.request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // Network-first for TMDb API calls
  if (url.hostname.includes('themoviedb') || url.hostname.includes('youtube')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});