const CACHE = 'invoice-handoff-v2';
const CORE = ['/', '/index.html', '/assets/handoff-hero.webp', '/assets/handoff-social.webp', '/favicon.svg'];
self.addEventListener('install', (event) => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  const index = await fetch('/index.html');
  const html = await index.clone().text();
  const buildAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]).filter((url) => url.startsWith('/assets/'));
  await cache.addAll([...CORE, ...buildAssets]);
  await self.skipWaiting();
})()));
self.addEventListener('activate', (event) => event.waitUntil((async () => {
  const names = await caches.keys();
  await Promise.all(names.filter((name) => name.startsWith('invoice-handoff-') && name !== CACHE).map((name) => caches.delete(name)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html', { ignoreVary: true })));
    return;
  }
  event.respondWith(caches.match(event.request, { cacheName: CACHE, ignoreVary: true }).then((hit) => hit || fetch(event.request).then((response) => { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, copy)); return response; })));
});
