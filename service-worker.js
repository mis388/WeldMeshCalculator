const CACHE_NAME = "metfab-mesh-calculator-v5";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/manifest.json",
    "/metfab-logo.jpg",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/apple-touch-icon.png",
    "/icons/favicon-32.png"
];

self.addEventListener("install", function (event) {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();
});


self.addEventListener("activate", function (event) {

    event.waitUntil(

        caches.keys().then(function (cacheNames) {

            return Promise.all(

                cacheNames.map(function (cacheName) {

                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }

                })

            );

        })

    );

    self.clients.claim();
});


self.addEventListener("fetch", function (event) {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(event.request)
            .then(function (cachedResponse) {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);

            })

    );

});
