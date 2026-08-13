const CACHE_NAME = "metfab-mesh-calculator-v6";

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


/* INSTALL NEW VERSION */

self.addEventListener("install", function (event) {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    // Activate new service worker immediately
    self.skipWaiting();
});


/* DELETE OLD CACHE */

self.addEventListener("activate", function (event) {

    event.waitUntil(

        caches.keys().then(function (cacheNames) {

            return Promise.all(

                cacheNames.map(function (cacheName) {

                    if (cacheName !== CACHE_NAME) {
                        console.log(
                            "Deleting old cache:",
                            cacheName
                        );

                        return caches.delete(cacheName);
                    }

                })

            );

        })

    );

    // Take control immediately
    self.clients.claim();
});


/* NETWORK FIRST FOR MAIN APP FILES */

self.addEventListener("fetch", function (event) {

    if (event.request.method !== "GET") {
        return;
    }

    const requestURL =
        new URL(event.request.url);

    const importantFiles = [
        "/",
        "/index.html",
        "/style.css",
        "/app.js",
        "/manifest.json"
    ];

    if (
        requestURL.origin === self.location.origin &&
        importantFiles.includes(requestURL.pathname)
    ) {

        event.respondWith(

            fetch(event.request)

                .then(function (networkResponse) {

                    const responseCopy =
                        networkResponse.clone();

                    caches.open(CACHE_NAME)
                        .then(function (cache) {

                            cache.put(
                                event.request,
                                responseCopy
                            );

                        });

                    return networkResponse;

                })

                .catch(function () {

                    return caches.match(
                        event.request
                    );

                })

        );

        return;
    }


    /* CACHE FIRST FOR IMAGES / ICONS */

    event.respondWith(

        caches.match(event.request)

            .then(function (cachedResponse) {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)

                    .then(function (networkResponse) {

                        const responseCopy =
                            networkResponse.clone();

                        caches.open(CACHE_NAME)

                            .then(function (cache) {

                                cache.put(
                                    event.request,
                                    responseCopy
                                );

                            });

                        return networkResponse;

                    });

            })

    );

});
