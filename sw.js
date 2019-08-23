const LATEST_CACHE_ID = "v3";

console.log("sw id", LATEST_CACHE_ID);

addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(async cachedResponse => {
      if (cachedResponse) return cachedResponse;
      const response = await fetch(fetchEvent.request);
      caches
        .open(LATEST_CACHE_ID)
        .then(cache => cache.put(fetchEvent.request, response));
      return response.clone();
    })
  );
});

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(LATEST_CACHE_ID)
      .then(cache =>
        cache
          .addAll(["/", "/index.html", "/sw-reg.js"])
          .then(() => self.skipWaiting())
      )
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches
      .keys()
      .then(keyList =>
        Promise.all(
          keyList.map(key => {
            if (key !== LATEST_CACHE_ID) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});
