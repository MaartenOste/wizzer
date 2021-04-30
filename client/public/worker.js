/*const CACHE_NAME = 'wizzer';
const urlsToCache = [
  '/',
  '/index.html',
  'logo.png',
  'nobglogo.png'
];


// Install a service worker
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
  caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});



// Cache and return requests
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request)
    .then(function(response) {
      if (response.ok) {
        console.log(`fetch to ${event.request.url} served from cache`);
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  let cacheWhitelist = ['wizzer'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

*/