const CACHE_NAME = "jeeva-v4";

const urlsToCache = [
  "./",
  "./index.html"
];

/* INSTALL */
self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 force update
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

/* ACTIVATE */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 🔥 clear old cache
          }
        })
      )
    )
  );
  self.clients.claim(); // 🔥 take control immediately
});

/* FETCH - NETWORK FIRST (IMPORTANT FIX) */
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone()); // update cache
          return response;
        });
      })
      .catch(() => caches.match(event.request)) // fallback to cache
  );
});
