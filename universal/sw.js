/* Universal safari — separate service-worker scope and cache. */
const ROOT="/arthur-tanzania-2026/universal/";
const CACHE="safari-universal-core-v1";
const MEDIA="safari-universal-media-v1";
const CORE=[ROOT,ROOT+"app-v1.js",ROOT+"universal-init.js",ROOT+"manifest.webmanifest",
"/arthur-tanzania-2026/styles.css","/arthur-tanzania-2026/assets/index-DdnHW3ql.css",
...["safari-extensions-v6.css","safari-daily-v7.css","safari-encounters-v8.css","safari-simplified-v9.css","safari-dates-v10.css","safari-story-v11.css","safari-story-visible-v12.css","safari-story-full-list-v15.css","safari-story-v17.css"].map(x=>"/arthur-tanzania-2026/"+x)];
self.addEventListener("install",e=>{e.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.allSettled(CORE.map(u=>cache.add(new Request(u,{cache:"reload"}))));await self.skipWaiting()})())});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith("safari-universal-")&&k!==CACHE&&k!==MEDIA)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener("fetch",e=>{
 const req=e.request;if(req.method!=="GET")return;
 const url=new URL(req.url);
 const media=(req.destination==="image"&&(url.pathname.includes("/arthur-tanzania-2026/animals/")||url.hostname.endsWith(".inaturalist.org")||url.hostname==="inaturalist-open-data.s3.amazonaws.com"));
 if(media){e.respondWith(caches.match(req).then(c=>c||fetch(req).then(res=>{if(res.ok||res.type==="opaque")caches.open(MEDIA).then(cache=>cache.put(req,res.clone())).catch(()=>{});return res})));return}
 if(req.mode==="navigate"&&url.origin===location.origin&&url.pathname.startsWith(ROOT)){e.respondWith(fetch(req).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put(ROOT,res.clone())).catch(()=>{});return res}).catch(()=>caches.match(ROOT)));return}
 if(url.origin===location.origin&&(url.pathname.startsWith(ROOT)||CORE.includes(url.pathname))){e.respondWith(fetch(req).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put(req,res.clone())).catch(()=>{});return res}).catch(()=>caches.match(req)))}
});
