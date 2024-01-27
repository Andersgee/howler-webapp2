import { initializeApp } from "firebase/app";
import { type Messaging, getMessaging, getToken, onMessage, type MessagePayload } from "firebase/messaging";

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
  //console.log("app:", app);
  const messaging = getMessaging(app);
  //console.log("messaging:", messaging);

  const _unsubscribeOnMessage = onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    onMsg(payload);
    // ...
  });
  return messaging;
}

export async function getFcmToken(messaging: Messaging, registration: ServiceWorkerRegistration) {
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  return token;
}
