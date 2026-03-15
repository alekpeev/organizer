// Service Worker — Майчин Органайзър PWA
const CACHE_NAME = 'maichin-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
  './favicon-32.png'
];

// Install — кешира статичните файлове
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate — изчиства стари кешове
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache за статичните файлове
self.addEventListener('fetch', function(event) {
  // За Apps Script заявки — винаги network
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
