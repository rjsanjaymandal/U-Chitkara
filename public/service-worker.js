// Simple service worker for basic caching
const CACHE_NAME = "study-notion-cache-v1";

// Install event - cache basic assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/index.html", "/index.css"]);
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
