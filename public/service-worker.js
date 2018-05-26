let cacheName = 'v2';
let cacheFiles = [
    './',
    './index.html',
    './javascripts/script.js',
    './javascripts/charts.js',
    './images/homeButton.png',
    './images/wallet.png',
    './images/plus.png',
    './stylesheets/reset.css',
    './stylesheets/style.css',
    './stylesheets/chartist.min.css',
];

self.addEventListener('install', function (e) {
    console.log("[ServiceWorker] Installed");

    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[ServiceWorker] Caching cacheFiles");
            return cache.addAll(cacheFiles);
        })
    )
});

self.addEventListener('activate', function (e) {
    console.log("[ServiceWorker] Activated");

    e.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (thisCacheName) {
                if (thisCacheName !== cacheName) {
                    console.log("[ServiceWorker] Removing Cached Files from ", thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function (e) {
    console.log("[ServiceWorker] Fetching", e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    )
});
