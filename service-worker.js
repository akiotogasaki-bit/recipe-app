// お江戸弁当 レシピ管理 Service Worker
// 2026-08-15 v4: ①末尾に古い版の残骸が19行ぶん重複しており、`const CACHE_FILES` の二重宣言で
//                 **構文エラー＝SWが登録も更新もされない状態だった**ので削除。
//                ②アイコンとテーマ色を差し替えたため CACHE_NAME を v3→v4 に上げる。
//                 activate で古いキャッシュを全削除するので、次に開いた時点で新しい絵に入れ替わる。
const CACHE_NAME = 'oedo-recipe-v4';
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
