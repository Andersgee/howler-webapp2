import { uint8ArrayFromBase64url } from "#src/utils/jsone";

export async function serviceWorkerGetRegistration() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  console.log("registrations.length:", registrations.length);
  return registrations.at(0) ?? null;
}

export async function serviceWorkerRegister() {
  console.log("running serviceWorkerRegister");
  if (!("serviceWorker" in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", { type: "module", scope: "/" });
    console.log("serviceWorkerRegister, registration:", registration);
    return registration;
  } catch {
    return null;
  }
}

export async function serviceWorkerUnregister() {
  if (!("serviceWorker" in navigator)) return false;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    return true;
  } catch {
    return false;
  }
}

export async function serviceWorkerGetExistingPushSubscription(registration: ServiceWorkerRegistration) {
  //if ('serviceWorker' in navigator && 'PushManager' in window)
  try {
    const existingPushSubscription = await registration.pushManager.getSubscription();
    return existingPushSubscription;
  } catch {
    return null;
  }
}

/** returns the existing if any, otherwise a new  */
export async function serviceWorkerGetPushSubscription(registration: ServiceWorkerRegistration) {
  //const registration = await navigator.serviceWorker.ready

  //"A new push subscription is created if the current service worker does not have an existing subscription."
  const pushSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: uint8ArrayFromBase64url(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
  });
  //setSubscription(sub)
  //await subscribeUser(sub)
  return pushSubscription;
}

async function unsubscribeFromPush(pushSubscription: PushSubscription) {
  const successfullyUnsubscribed = await pushSubscription.unsubscribe();
  return successfullyUnsubscribed;
  //setSubscription(null)
  //await unsubscribeUser()
}

/*
{
  "subject" : "mailto: <andersgee@gmail.com>",
  "publicKey" : "BEo5TtPhcwM2Abf98BdvY-0U2hUGPsb5A3IJ9ROhfBFZU1wEvFDOI_hGDZUQeEM12jktgRZ6ybZsGq8gkGVjJMo",
  "privateKey" : "nFLfmWwcnXZSSMs7A1e4lFp1_j3ObhsJCNQZ9j-CEQI"
  }
*/
