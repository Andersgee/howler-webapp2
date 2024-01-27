export async function registerSW(scriptURL = "/sw.js") {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register(scriptURL, { type: "module", scope: "/" });

    //force update or not?
    //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
    //await registration.update() //force update unless the existing is identical
    return registration;
  } catch {
    return null;
  }
}

export async function unregisterSW() {
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
