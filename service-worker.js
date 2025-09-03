const CACHE_NAME = 'yamagotchi-v1';

self.addEventListener("install", (event) => {
  console.log("Service Worker instalando...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cacheando recursos estáticos");
      return cache.addAll(STATIC_RESOURCES);
    }).then(() => {
      console.log("Service Worker instalado exitosamente");
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activando...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Limpiando cache antiguo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log("Service Worker activado exitosamente");
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Solo interceptar requests HTTP/HTTPS
  if (event.request.url.startsWith('http')) {
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.log("Fetch falló:", error);
        return new Response('Network error', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
    );
  }
});