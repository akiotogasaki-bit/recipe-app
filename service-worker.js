const CACHE_NAME = 'oedo-recipe-v3';
const CACHE_FILES = [
  '/recipe-app/',
  '/recipe-app/index.html',
  '/recipe-app/manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('script.google.com')) return;
  // index.htmlは常に最新を取得
  if (e.request.url.includes('index.html') || e.request.url.endsWith('/recipe-app/')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
const CACHE_FILES = [
  '/recipe-app/',
  '/recipe-app/index.html',
  '/recipe-app/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_FILES))
  );
});

self.addEventListener('fetch', e => {
  // GASへのリクエストはキャッシュしない
  if (e.request.url.includes('script.google.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
