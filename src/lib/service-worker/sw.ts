//create sw.js from this file with "pnpm bundlesw"

//import { initializeApp } from "firebase/app";
//import { getMessaging } from "firebase/messaging/sw";
//import { onBackgroundMessage } from "firebase/messaging/sw";
import { kek } from "./bej";

declare let self: ServiceWorkerGlobalScope;

//ok, console logs show up in chrome but not in firefox
//console.log("SW: 99 * kek(9):", 99 * kek(9));

async function asynclog(msg: string) {
  return await new Promise((resolve) => {
    console.log(msg, kek(3));
    resolve(undefined);
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
