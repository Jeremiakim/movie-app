const CACHE_NAME = "v1";
const OFFLINE_URL = "offline.html";

// Daftar aset yang akan dicache
const ASSETS_TO_CACHE = [
  "/",
  "/styles/main.css",
  "/script/main.js",
  "/images/logo.png",
  OFFLINE_URL,
];

// Install event - Menyimpan aset ke cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Fetch event - Cache First dengan Offline Fallback
self.addEventListener("fetch", (event) => {
  // Cek apakah request adalah navigasi halaman
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        console.log("[Service Worker] User offline, menampilkan offline.html");
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
        fetch(event.request).then((response) => {
          // Simpan di cache jika berhasil
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});

// Activate event - Membersihkan cache lama
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
