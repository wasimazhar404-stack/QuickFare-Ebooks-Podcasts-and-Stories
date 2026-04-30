/**
 * QuickFare OTT - Service Worker
 * Cache-first strategy for static assets, network fallback for API
 */

const CACHE_NAME = 'quickfare-v1';
const STATIC_CACHE = 'quickfare-static-v1';
const IMAGE_CACHE = 'quickfare-images-v1';
const API_CACHE = 'quickfare-api-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install: Cache static shell
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !name.startsWith('quickfare-v1') && !name.startsWith('quickfare-static-v1') && !name.startsWith('quickfare-images-v1') && !name.startsWith('quickfare-api-v1'))
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (except for covers)
  if (url.origin !== self.location.origin && !url.pathname.startsWith('/covers/')) return;

  // Strategy: Cache-first for static assets (JS, CSS, HTML)
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Strategy: Cache-first for images (book covers)
  if (isImage(request)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Strategy: Network-first for API/data requests
  if (isAPI(request)) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Default: Stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

/* ───── Strategy Helpers ───── */

function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(js|css|html|json|woff2?|ttf|otf)$/.test(url.pathname);
}

function isImage(request) {
  const url = new URL(request.url);
  return /\.(png|jpe?g|gif|webp|svg|ico)$/.test(url.pathname) || url.pathname.startsWith('/covers/');
}

function isAPI(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Return offline fallback if available
    return cached || new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await cache.match(request);
    return cached || new Response(JSON.stringify({ offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

/* ───── Background Sync ───── */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reading-progress') {
    console.log('[SW] Background sync: reading progress');
    event.waitUntil(syncReadingProgress());
  }
});

async function syncReadingProgress() {
  // Placeholder: sync reading progress from IndexedDB to server
  // Implementation would read from IndexedDB and send to API
  console.log('[SW] Reading progress synced');
}

/* ───── Push Notifications ───── */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New book available on QuickFare!',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    tag: data.tag || 'quickfare-notification',
    requireInteraction: false,
    actions: data.actions || [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    data: data.url ? { url: data.url } : undefined,
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'QuickFare OTT',
      options
    )
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const { action, notification } = event;

  if (action === 'dismiss') return;

  const url = notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
