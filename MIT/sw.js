/* =========================================================
   SERVICE WORKER
   Caches static assets for offline use on GitHub Pages.
   Install this by adding to your main HTML:
   
   <script>
     if ('serviceWorker' in navigator) {
       navigator.serviceWorker.register('sw.js');
     }
   </script>
========================================================= */

const CACHE_VERSION = 'lagersync-v1';

self.addEventListener('install', event => {
  // Skip waiting—activate immediately
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Network-first strategy: try network first, fall back to cache only if needed
  // For local file:// testing, skip caching entirely to avoid 503 errors
  if (event.request.url.startsWith('file://')) {
    return; // Don't intercept local file requests
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const cache = caches.open(CACHE_VERSION);
          cache.then(c => c.put(event.request, response.clone()));
        }
        return response;
      })
      .catch(() => {
        // Network failed; try cache
        return caches.match(event.request)
          .then(cachedResponse => {
            return cachedResponse || new Response('Offline - resource not cached', { status: 503 });
          });
      })
  );
});

self.addEventListener('activate', event => {
  // Clean up old cache versions
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_VERSION)
          .map(name => caches.delete(name))
      );
    })
  );
});
