const CACHE_NAME = "v4"; // Update versi cache
const OFFLINE_URL = "/offline.html";

// Daftar aset yang dicache agar offline.html bisa ditampilkan dengan benar
const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  "/styles/main.css", // Tambahkan CSS untuk offline page
  "/script/main.js", // Tambahkan JS jika diperlukan
  "/images/logo.png", // Tambahkan logo atau gambar lain yang dipakai
];

// Install event - Cache offline.html dan aset pendukung
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching offline page & assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Langsung aktifkan SW baru
});

// Fetch event - Menampilkan offline.html saat user offline
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Handle navigasi halaman (misal detail film)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone()); // Simpan ke cache
            return response;
          });
        })
        .catch(() => {
          console.log("[Service Worker] Offline! Menampilkan offline.html.");
          return caches.match(new Request(OFFLINE_URL, { cache: "reload" }));
        })
    );
    return;
  }

  // Cache-first untuk aset statis (CSS, JS, Gambar)
  if (["script", "style", "image"].includes(event.request.destination)) {
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
              console.log("[Service Worker] Fetch asset gagal, gunakan cache.");
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

// Activate event - Menghapus cache lama saat ada update SW
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
