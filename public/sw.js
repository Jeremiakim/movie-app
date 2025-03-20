const CACHE_NAME = "v3"; // Naikkan versi cache untuk update
const OFFLINE_URL = "/offline.html"; // Halaman fallback offline

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching offline page...");
      return cache.addAll([OFFLINE_URL]);
    })
  );
  self.skipWaiting();
});

// Fetch event - Handle Offline Fallback
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Jika request adalah halaman navigasi (misal detail film)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone()); // Simpan halaman ke cache
            return response;
          });
        })
        .catch(() => {
          console.log("[Service Worker] Offline! Menampilkan offline.html.");
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Cache-first untuk aset statis
  if (
    event.request.destination === "script" ||
    event.request.destination === "style" ||
    event.request.destination === "image"
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request)
            .then((response) => {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
              });
            })
            .catch(() => {
              console.log("[Service Worker] Gagal fetch asset, gunakan cache.");
              return caches.match(event.request);
            })
        );
      })
    );
    return;
  }

  // Network-first untuk API agar selalu up-to-date
  if (event.request.url.includes("api.themoviedb.org")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        console.warn("[Service Worker] API fetch gagal, tidak bisa cache!");
        return new Response(JSON.stringify({ error: "Network error" }), {
          headers: { "Content-Type": "application/json" },
        });
      })
    );
    return;
  }
});

// Hapus cache lama saat aktivasi
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Menghapus cache lama:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
