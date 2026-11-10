const CACHE_NAME = 'learnhub-2da2b26';
const urlsToCache = [
    './',
    './index.html',
    './install.html',
    './css/style.css',
    './js/topics-1.js',
    './js/topics-2.js',
    './js/topics-3.js',
    './js/app.js',
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Allow the page to activate a waiting worker immediately
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request, { cache: 'no-cache' })
            .then(response => {
                // Clone the response
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseClone);
                    });
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
