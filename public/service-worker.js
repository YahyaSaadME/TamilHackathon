const CACHE_NAME = "tamil2-cache-v2";
const STATIC_CACHE = "tamil2-static-v2";
const DYNAMIC_CACHE = "tamil2-dynamic-v2";

// Static assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png",
  // Cache common Next.js assets patterns
  "/_next/static/",
  "/_next/image"
];

// Pages to cache for offline access
const PAGES_TO_CACHE = [
  "/",
  "/ocr",
  "/translator"
];

// Install event - cache static assets
self.addEventListener("install", event => {
  console.log("Service Worker installing.");
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log("Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(CACHE_NAME).then(cache => {
        console.log("Caching pages");
        return cache.addAll(PAGES_TO_CACHE);
      })
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", event => {
  console.log("Service Worker activating.");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Handle pages with network-first strategy (for updates)
  event.respondWith(networkFirstStrategy(request));
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Cache-first strategy failed:", error);
    // Return offline fallback for critical assets
    if (request.destination === "document") {
      return caches.match("/");
    }
    return new Response("Offline", { status: 503 });
  }
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Network-first strategy failed, trying cache:", error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback for pages
    if (request.destination === "document") {
      return caches.match("/");
    }

    return new Response("Offline", { status: 503 });
  }
}

// Handle messages from the main thread
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
