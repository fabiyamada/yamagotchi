// service-worker.js

const CACHE_NAME = 'yamagotchi-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Agrega aquí los archivos CSS y JS principales de tu app
  // '/styles/main.css',
  // '/scripts/main.js',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
//  console.log('Service Worker instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
      //  console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Error durante la instalación:', error);
      })
  );
  
  // Forzar la activación inmediata
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
//  console.log('Service Worker activado');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Tomar control de todas las páginas inmediatamente
  return self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si encuentra en cache, retorna la respuesta cacheada
        if (response) {
          return response;
        }
        
        // Si no está en cache, hace la petición a la red
        return fetch(event.request)
          .then((response) => {
            // No cachear respuestas no válidas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar la respuesta para poder usarla y cachearla
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Error en fetch:', error);
            // Aquí podrías retornar una página offline si la tienes
          });
      })
  );
});

// Manejo de mensajes desde la app principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
