import { initializeApp } from "firebase/app";
import {
  type Messaging,
  getMessaging,
  getToken,
  onMessage,
  type MessagePayload as FirebaseMessagePayload,
} from "firebase/messaging";

export type MessagePayload = FirebaseMessagePayload & { triggeredByExternalNotificationClick?: boolean };

/**
 * Note: The Firebase config object contains unique, but non-secret identifiers for your Firebase project.
 * @see https://firebase.google.com/docs/web/learn-more#config-object
 * */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAroe8n3vb7b9FooVuf8Q9UAXXcCIZ4SNI",
  authDomain: "howler-67f34.firebaseapp.com",
  projectId: "howler-67f34",
  storageBucket: "howler-67f34.appspot.com",
  messagingSenderId: "942074740899",
  appId: "1:942074740899:web:f7b3aec1d8bead76b2ff16",
};

export function initCloudMessaging(onMsg: (payload: MessagePayload) => void) {
  const app = initializeApp(FIREBASE_CONFIG);
  const messaging = getMessaging(app);

  const _unsubscribeOnMessage = onMessage(messaging, (payload) => {
    //console.log("Message received, payload:", payload);
    /*
    {
  "from": "942074740899",
  "messageId": "633d7f7a-495f-4f79-888f-51e04f728450",
  "notification": {
    "title": "Anders Gustafsson howled!",
    "body": "test selfnotify",
    "icon": "http://localhost:3000/icons/favicon-48.png"
  },
  "data": {
    "id": "23"
    "relativeLink": "/event/M0J20"
  },
  "fcmOptions": {
    "link": "http://localhost:3000/event/M0J20"
  }
}
    */
    onMsg(payload);
  });

  //so when clicking a notification...
  // - if app is closed it opens it and navigates to fcm_options.link
  // - if app is in focus then the above onMessage is triggered and nothing else
  // - but if app is open (but not in focus), the firebase service worker only focuses the app but also does a client.postMessage(internalPayload)
  //   that we can listen to: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/message_event
  //   also this was difficult to figure out... props to this guys comment: https://github.com/firebase/firebase-js-sdk/issues/3922#issuecomment-1197002484
  //
  // TODO: should prob have a different typed onMsg here
  // for now just cast this data as MessagePayload.. writing this before knowing if it even works.
  navigator.serviceWorker.onmessage = (ev) =>
    onMsg({ ...ev.data, triggeredByExternalNotificationClick: true } as MessagePayload);

  return messaging;
}

export async function getFcmToken(messaging: Messaging, registration: ServiceWorkerRegistration) {
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  return token;
}
