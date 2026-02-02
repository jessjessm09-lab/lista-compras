const CACHE_NAME = 'lista-compras-v1';
const urlsToCache = [
  '/lista-compras/',
  '/lista-compras/index.html',
  '/lista-compras/styles.css',
  '/lista-compras/app.js',
  '/lista-compras/manifest.json',
  '/lista-compras/icon-192.png',
  '/lista-compras/icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devuelve la respuesta cacheada
        if (response) {
          return response;
        }
        
        // Si no, hace la petición a la red
        return fetch(event.request).then(
          response => {
            // Verifica si la respuesta es válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona la respuesta
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});
