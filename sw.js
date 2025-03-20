const CACHE_NAME = "v2"; // Ubah versi untuk memicu update cache
const OFFLINE_URL = "/offline.html"; // Halaman fallback saat offline

// Daftar aset yang akan dicache
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/styles/main.css",
  "/script/main.js",
  "/images/logo.png",
  OFFLINE_URL,
];

// Install event - Cache semua aset
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Langsung aktifkan SW baru
});

// Fetch event - Strategi cache dengan fallback offline
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Jika user membuka halaman, coba fetch dari network dulu
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          console.log(
            "[Service Worker] User offline, menampilkan offline.html"
          );
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Untuk semua request lain, gunakan cache first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request)
          .then((response) => {
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch(() => {
            console.log("[Service Worker] Fetch gagal, mencoba dari cache...");
            return caches.match(event.request);
          })
      );
    })
  );
});

// Activate event - Hapus cache lama
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
  self.skipWaiting(); // Paksa update ke versi baru
});
