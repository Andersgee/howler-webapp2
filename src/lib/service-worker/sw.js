// src/lib/service-worker/bej.ts
function kek(h) {
  return h * 2;
}

// src/lib/service-worker/sw.ts
async function asynclog(msg) {
  return await new Promise((resolve) => {
    console.log(msg, kek(3));
    resolve(void 0);
  });
}
self.addEventListener("install", (event) => {
  const a = self.skipWaiting();
  const b = asynclog("SW: installed");
  const promise = Promise.all([a, b]);
  event.waitUntil(promise);
});
self.addEventListener("activate", (event) => {
  const a = self.clients.claim();
  const b = asynclog("SW: activated");
  const promise = Promise.all([a, b]);
  event.waitUntil(promise);
});
self.addEventListener("push", (event) => {
  const a = self.registration.showNotification("Hello, World.");
  const promise = Promise.all([a]);
  event.waitUntil(promise);
});
