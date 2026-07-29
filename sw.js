/* Bangkok Guide — Service Worker v1.1 */

const CACHE_NAME = 'bangkok-guide-v2';

// Assets to pre-cache on install
const PRECACHE_URLS = [
  '.',
  'index.html',
  'css/layout.css',
  'css/sidebar.css',
  'css/card.css',
  'css/home.css',
  'js/loader.js',
  'js/icons.js',
  'js/renderer.js',
  'js/sidebar.js',
  'js/filter.js',
  'js/home.js',
  'js/map.js',
  'js/app.js',
  'data/categories.json',
  'data/sections.json',
  'assets/icons/icon.svg',
  'manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clean old caches
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((n) => n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // For HTML pages: network-first (always get latest content)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // For static assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        // Cache successful responses for future
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
