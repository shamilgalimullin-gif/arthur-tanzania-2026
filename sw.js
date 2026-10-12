const CACHE = 'arthur-safari-v8';
const ROOT = new URL('./', self.location.href).pathname;
const APP_PAGE = ROOT === '/' ? '/safari' : ROOT;
const ANIMAL_IDS = ['lion','elephant','buffalo','rhino','leopard','cheetah','hyena','jackal','bat-eared-fox','mongoose','giraffe','zebra','wildebeest','impala','thomson-gazelle','grant-gazelle','eland','topi','hartebeest','waterbuck','dikdik','reedbuck','bushbuck','oryx','hippo','warthog','baboon','vervet','rock-hyrax','porcupine','ostrich','secretary','crowned-crane','flamingo','kori-bustard','roller','hornbill','marabou','vulture','fish-eagle','guineafowl','weaver','crocodile','monitor','tortoise','greater-kudu','lesser-kudu','gerenuk','wild-dog','golden-wolf','caracal','aardwolf','honey-badger','pangolin','aardvark','genet','civet','bushbaby','african-hare','springhare','striped-hyena','common-duiker','klipspringer','steenbok','bushpig','ground-hornbill','bateleur','martial-eagle','tawny-eagle','white-backed-vulture','lappet-faced-vulture','yellow-billed-stork','saddle-billed-stork','fischer-lovebird','superb-starling','red-yellow-barbet','go-away-bird','rock-python','agama','flap-necked-chameleon','puff-adder'];
const OFFLINE = [APP_PAGE, `${ROOT}assets/index-safari-v8.js`, `${ROOT}assets/index-DdnHW3ql.css`, `${ROOT}styles.css`, `${ROOT}safari-extensions-v6.css`, `${ROOT}safari-daily-v7.css`, `${ROOT}safari-encounters-v8.css`, `${ROOT}serengeti.jpg`, `${ROOT}manifest.webmanifest`, `${ROOT}animals/serval.png`, ...ANIMAL_IDS.map(id => `${ROOT}animals/${id}.jpg`)];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(OFFLINE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate' && url.pathname.startsWith(APP_PAGE)) {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(APP_PAGE, copy));
      return response;
    }).catch(() => caches.match(APP_PAGE)));
    return;
  }

  const externalAnimalPhoto = request.destination === 'image' && (url.hostname.endsWith('.inaturalist.org') || url.hostname === 'inaturalist-open-data.s3.amazonaws.com');
  if (externalAnimalPhoto) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok || response.type === 'opaque') caches.open(CACHE).then(cache => cache.put(request, response.clone())).catch(() => {});
      return response;
    })));
    return;
  }

  const isStaticSafariAsset = url.origin === self.location.origin && (
    url.pathname.startsWith(`${ROOT}animals/`) ||
    url.pathname.startsWith(`${ROOT}assets/`) ||
    url.pathname === `${ROOT}styles.css` ||
    url.pathname === `${ROOT}safari-extensions-v6.css` ||
    url.pathname === `${ROOT}safari-daily-v7.css` ||
    url.pathname === `${ROOT}safari-encounters-v8.css` ||
    url.pathname === `${ROOT}serengeti.jpg` ||
    url.pathname === `${ROOT}manifest.webmanifest`
  );

  if (isStaticSafariAsset) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    })));
  }
});
