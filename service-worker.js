self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activado");
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Para inicio, solo deja pasar todo
  event.respondWith(fetch(event.request));
});