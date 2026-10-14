/* Safari v12: reliable updates on slow mobile networks.
   Update the page and UI first; cache wildlife photos only as they are viewed. */
const CACHE = 'arthur-safari-v15';
const MEDIA_CACHE = 'arthur-safari-media-v12';
const ROOT = new URL('./', self.location.href).pathname;
const APP_PAGE = ROOT;
const CORE = [
  APP_PAGE,
  ROOT + 'assets/index-safari-v15.js',
  ROOT + 'assets/index-DdnHW3ql.css',
  ROOT + 'styles.css',
  ROOT + 'safari-extensions-v6.css',
  ROOT + 'safari-daily-v7.css',
  ROOT + 'safari-encounters-v8.css',
  ROOT + 'safari-simplified-v9.css',
  ROOT + 'safari-dates-v10.css',
  ROOT + 'safari-story-v11.css',
  ROOT + 'safari-story-visible-v12.css',
  ROOT + 'safari-story-full-list-v15.css',
  ROOT + 'manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Each request is independent. An unavailable old CSS file won't block the update.
    await Promise.allSettled(CORE.map(url =>
      cache.add(new Request(url, { cache: 'reload' }))
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Keep the preceding image-rich cache for offline wildlife photos during the trip.
    const old = keys.filter(key =>
      key.startsWith('arthur-safari-v') &&
      key !== CACHE &&
      key !== 'arthur-safari-v12'
    );
    await Promise.all(old.map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if (req.mode === 'navigate' && sameOrigin && url.pathname.startsWith(ROOT)) {
    event.respondWith(
      fetch(req, { cache: 'no-store' }).then(async response => {
        if (response.ok) {
          const cache = await caches.open(CACHE);
          cache.put(APP_PAGE, response.clone()).catch(() => {});
        }
        return response;
      }).catch(async () =>
        (await caches.match(APP_PAGE)) ||
        new Response('Приложение офлайн. Подключитесь к сети для обновления.', {
          status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        })
      )
    );
    return;
  }

  const externalWildlifePhoto = req.destination === 'image' &&
    (url.hostname.endsWith('.inaturalist.org') || url.hostname === 'inaturalist-open-data.s3.amazonaws.com');
  const wildlifePhoto = sameOrigin && url.pathname.startsWith(ROOT + 'animals/');

  if (wildlifePhoto || externalWildlifePhoto) {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => {
      if (response.ok || response.type === 'opaque') {
        caches.open(MEDIA_CACHE).then(cache => cache.put(req, response.clone())).catch(() => {});
      }
      return response;
    })));
    return;
  }

  const appAsset = sameOrigin && (
    url.pathname.startsWith(ROOT + 'assets/') ||
    url.pathname === ROOT + 'styles.css' ||
    url.pathname.endsWith('.css') && url.pathname.startsWith(ROOT) ||
    url.pathname === ROOT + 'manifest.webmanifest'
  );
  if (appAsset) {
    // Do not keep serving previous-version CSS and JS when connectivity is available.
    event.respondWith(fetch(req, { cache: 'no-cache' }).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(req, response.clone())).catch(() => {});
      return response;
    }).catch(() => caches.match(req)));
  }
});
