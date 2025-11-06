const CACHE_NAME = 'todo-pwa-cache-v1';

// List of files to cache. Must include the main HTML, manifest, and Service Worker itself.
const urlsToCache = [
  './', 
  'index.html',
  'manifest.json',
  // IMPORTANT: Add your icon files here when you create them
  'icon-192x192.png',
  'icon-512x512.png'
];

// Install event: Cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting(); 
});

// Fetch event: Serve files from cache first, then fall back to the network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the file is in the cache, return it immediately
        if (response) {
          return response;
        }
        // Otherwise, fetch it from the network
        return fetch(event.request);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches that are not in the whitelist
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensures the service worker controls clients immediately
});
