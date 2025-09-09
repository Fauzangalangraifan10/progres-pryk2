// src/scripts/sw.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import CONFIG from './config';

// Aktifkan SW langsung setelah install
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

// 1️⃣ Precaching file hasil build
precacheAndRoute(self.__WB_MANIFEST || []);

// 2️⃣ Cache Google Fonts
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
  }),
);

// 3️⃣ Cache FontAwesome
registerRoute(
  ({ url }) => url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome'),
  new CacheFirst({
    cacheName: 'fontawesome',
  }),
);

// 4️⃣ Cache avatars
registerRoute(
  ({ url }) => url.origin === 'https://ui-avatars.com',
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }), // Cache selama 30 hari
    ],
  }),
);

// 5️⃣ Cache API (JSON / data) - Strategi NetworkFirst
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-api',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 }), // Cache selama 1 hari
    ],
  }),
);

// 6️⃣ Cache API images - Strategi StaleWhileRevalidate
registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }), // Cache selama 30 hari
    ],
  }),
);

// 7️⃣ Cache Map / Tiles
registerRoute(
  ({ url }) => url.origin.includes('maptiler'),
  new CacheFirst({ cacheName: 'map-tiles' }),
);

// 8️⃣ Push notification handler [PERBAIKAN]
self.addEventListener('push', (event) => {
  // ✅ SOLUSI: Tambahkan blok try...catch untuk parsing data agar tidak error
  let data;
  try {
    // Coba parse data push sebagai JSON
    data = event.data.json();
  } catch (error) {
    // Jika gagal (misal data kosong), gunakan data default
    console.error('Push event data is not valid JSON:', error);
    data = {
      title: 'Story App',
      options: {
        body: 'Ada cerita baru untukmu!',
        icon: '/icons/icon-192x192.png', // Tambahkan ikon agar lebih menarik
        badge: '/icons/icon-72x72.png',
      },
    };
  }

  const title = data.title || 'Story App';
  const options = data.options || {
    body: 'Ada cerita baru untukmu!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


// 9️⃣ Klik notifikasi handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Ambil URL dari data notifikasi, jika tidak ada, buka halaman utama
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Cek jika tab dengan URL yang sama sudah terbuka
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika tidak ada tab yang terbuka, buka window baru
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }),
  );
});