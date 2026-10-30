// 恐怖の種 クラフト: keeps the one-file page so it opens without a network.
// Online: always fetch the latest page (no-cache revalidates past the browser's HTTP cache), then save it.
// Offline, or once the page is gone (404 after the repo turns private): the saved copy is served.
const C='kyofu-craft-v19';
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll([new Request('./',{cache:'no-cache'}),new Request('./index.html',{cache:'no-cache'})])).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C && /^kyofu-craft-v\d+$/.test(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const fromCache=()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'?caches.match('./'):undefined));
  e.respondWith(fetch(e.request.url,{cache:'no-cache'}).then(r=>{
    if(r.ok){ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return r; }
    return fromCache().then(c=>c||r);
  }).catch(()=>fromCache().then(c=>c||Response.error())));
});
