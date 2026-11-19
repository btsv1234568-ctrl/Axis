const V='axis-v2',FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* сначала кэш (мгновенный запуск и работа без интернета), в фоне — обновление; страница при любом адресе открывается из кэша */
self.addEventListener('fetch',e=>{
  const q=e.request;if(q.method!=='GET')return;
  e.respondWith(caches.match(q,{ignoreSearch:true}).then(hit=>{
    const net=fetch(q).then(res=>{if(res&&res.ok&&new URL(q.url).origin===location.origin){const cp=res.clone();caches.open(V).then(c=>c.put(q,cp))}return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return net.then(res=>res||(q.mode==='navigate'?caches.match('./index.html'):Response.error()))}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./')))});
