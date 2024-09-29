import { type Message } from "../cloud-messaging-light/notify";
//import { kek } from "./bej";

//create sw.js from this file with "pnpm bundlesw"

declare const self: ServiceWorkerGlobalScope;

async function asynclog(...data: unknown[]) {
  return await new Promise((resolve) => {
    console.log(...data);
    resolve(undefined);
  });
}

self.addEventListener("install", (event) => {
  void self.skipWaiting(); //makes a new worker activate directly after ready instead of waiting for app close
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
  const message = JSON.parse(event.data!.text()) as Message;

  const a = self.registration.showNotification(message.title, {
    body: message.body,
    icon: message.icon ?? "/icons/favicon-96.png",
    badge: "/icons/badge.png",
    image: message.image,
    data: message,
    //tag: "event-xLen3",
    //actions
  });

  //const b = debuglog("onpush: ", message.relativeLink);

  const promise = Promise.all([a]);
  event.waitUntil(promise);
});

self.addEventListener("notificationclick", (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Do something as the result of the notification click
  //const a = doSomething();

  //clickedNotification.title
  //clickedNotification.body
  //clickedNotification.data
  //clickedNotification.tag
  const message = clickedNotification.data as Message;

  const url = absUrl(message.relativeLink);
  //const b = debuglog("onclick:", message.relativeLink);

  //TODO: focus the tab insead if its already open?
  //https://developer.mozilla.org/en-US/docs/Web/API/Clients/openWindow
  const c = self.clients.openWindow(url);

  const promise = Promise.all([c]);
  event.waitUntil(promise);
});

function absUrl(relativeLink: string) {
  const url = new URL(relativeLink, self.location.href).href;
  return url;
}

/*
async function debuglog(prelude: string, url: string) {
  const hasFocus = await appHasFocus();
  const hasUrlFocus = await appHasUrlFocus(url);
  console.log(prelude, JSON.stringify({ url, hasFocus, hasUrlFocus }));
}

async function appHasUrlFocus(url: string) {
  try {
    const clients = await getClients();
    return clients.some((client) => client.url === url);
  } catch {
    return false;
  }
}

async function appHasFocus() {
  try {
    const clients = await getClients();
    return clients.some((client) => "focus" in client);
  } catch {
    return false;
  }
}

function hasVisibleClients(clients: WindowClient[]) {
  return clients.some(
    (client) =>
      client.visibilityState === "visible" &&
      // Ignore chrome-extension clients as that matches the background pages
      // of extensions, which are always considered visible for some reason.
      !client.url.startsWith("chrome-extension://")
  );
}

async function getClients() {
  //return await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  return await self.clients.matchAll({ type: "window" });
}
*/

/*
type PushSubscriptionChangeEvent = ExtendableEvent & {
  readonly newSubscription: PushSubscription | null;
  readonly oldSubscription: PushSubscription | null;
};

//todo: perhaps update subscription like in this example
//https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/pushsubscriptionchange_event#examples
self.addEventListener("pushsubscriptionchange", (ev) => {
  const event = ev as PushSubscriptionChangeEvent;
  const a = asynclog("pushsubscriptionchange:");
  const promise = Promise.all([a]);
  event.waitUntil(promise);
});
*/
