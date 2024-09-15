// src/lib/service-worker/bej.ts
function kek(h) {
  return h * 2;
}

// src/lib/service-worker/sw.ts
async function asynclog(...data) {
  return await new Promise((resolve) => {
    console.log(...data, kek(3));
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
self.addEventListener("notificationclick", (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();
  const a = asynclog("clickedNotification.body:", clickedNotification.body);
  const promise = Promise.all([a]);
  event.waitUntil(promise);
});
