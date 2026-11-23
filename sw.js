// يخزن التطبيق والمكتبات: يفتح فوراً من الكاش ويتحدّث بالخلفية (يظهر التحديث بالفتحة الجاية)
const SHELL="shell-v14";
const PRE=["./","index.html","manifest.webmanifest","icon-192.png","https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css","https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(SHELL).then(c=>Promise.all(PRE.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("shell-")&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  const mine=u.origin===location.origin||/(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.host);
  if(!mine&&r.mode!=="navigate")return;
  e.respondWith(caches.match(r,{ignoreSearch:r.mode==="navigate"}).then(m=>{
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(SHELL).then(c=>c.put(r,cp)).catch(()=>{})}return res}).catch(()=>m||(r.mode==="navigate"?caches.match("./"):undefined));
    return m||net}))});
