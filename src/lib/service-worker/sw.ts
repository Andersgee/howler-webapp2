//create sw.js from this file with "pnpm bundlesw"

//import { initializeApp } from "firebase/app";
//import { getMessaging } from "firebase/messaging/sw";
//import { onBackgroundMessage } from "firebase/messaging/sw";
//import { JSONE } from "#src/utils/jsone";
import { kek } from "./bej";

declare let self: ServiceWorkerGlobalScope;

//ok, console logs show up in chrome but not in firefox
//console.log("SW: 99 * kek(9):", 99 * kek(9));

async function asynclog(...data: unknown[]) {
  return await new Promise((resolve) => {
    console.log(...data, kek(3));
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
  //todo: validate with zod here, no reason the service worker should not be typesafe
  //const data = JSONE.parse(event.data!.text()) as {
  //  title: string;
  //  body: string;
  //  relativeLink: string;
  //  //createdAt: Date;
  //};

  console.log("event.data?.text()", event.data?.text());

  const a = self.registration.showNotification("some title", {
    //tag: "event-xLen3",
    body: "some body",
    icon: "/icons/favicon-512.png",
    badge: "/icons/badge.png",
    data: event.data?.text(),
  });

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

  const a = asynclog("clickedNotification.body:", clickedNotification.body);
  const b = self.clients.openWindow("http://localhost:3000/event");
  const promise = Promise.all([a, b]);
  event.waitUntil(promise);
});