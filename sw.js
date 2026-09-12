// Service Worker - للعمل بدون إنترنت
const CACHE_NAME = 'game-tech-quiz-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// تثبيت Service Worker
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// جلب الملفات من الـ Cache أولاً، ثم من الإنترنت
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(e.request).then(response => {
        // لا نخزن الاستجابات الجديدة تلقائياً
        return response;
      }).catch(() => {
        // في حالة عدم الاتصال، نحاول من الـ Cache
        return caches.match(e.request);
      });
    })
  );
});