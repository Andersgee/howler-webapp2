// src/lib/service-worker/sw.ts
async function asynclog(...data) {
  return await new Promise((resolve) => {
    console.log(...data);
    resolve(void 0);
  });
}
self.addEventListener("install", (event) => {
  void self.skipWaiting();
  const a = asynclog("SW: install");
  const promise = Promise.all([a]);
  event.waitUntil(promise);
});
self.addEventListener("activate", (event) => {
  const a = self.clients.claim();
  const b = asynclog("SW: activate");
  const promise = Promise.all([a, b]);
  event.waitUntil(promise);
});
self.addEventListener("push", (event) => {
  const message = JSON.parse(event.data.text());
  const a = self.registration.showNotification(message.title, {
    body: message.body,
    icon: message.icon ?? "/icons/favicon-48.png",
    badge: "/icons/badge.png",
    image: message.image,
    data: message
    //tag: "event-xLen3",
    //actions
  });
  const promise = Promise.all([a]);
  event.waitUntil(promise);
});
self.addEventListener("notificationclick", (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();
  const message = clickedNotification.data;
  const url = absUrl(message.relativeLink);
  const c = self.clients.openWindow(url);
  const promise = Promise.all([c]);
  event.waitUntil(promise);
});
function absUrl(relativeLink) {
  const url = new URL(relativeLink, self.location.href).href;
  return url;
}
