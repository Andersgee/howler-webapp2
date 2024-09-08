export async function serviceWorkerRegister() {
  console.log("running serviceWorkerRegister");
  if (!("serviceWorker" in navigator)) return null;

  try {
    //const scriptURL = new URL("./sw.js", import.meta.url);
    const scriptURL = "/sw.js";
    console.log("scriptURL:", scriptURL.toString());
    const registration = await navigator.serviceWorker.register(scriptURL, { type: "module", scope: "/" });
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

export async function serviceWorkerGetPushSubscription(registration: ServiceWorkerRegistration) {
  try {
    const pushSubscription = await registration.pushManager.getSubscription();
    return pushSubscription;
  } catch {
    return null;
  }
}
