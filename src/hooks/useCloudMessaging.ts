import { initCloudMessaging, getFcmToken } from "#src/lib/cloud-messaging";
import { payloadDispatch } from "#src/store";
import { useEffect } from "react";
import { useStore } from "#src/store";
import { JSONE } from "#src/utils/jsone";
import { type Messaging } from "firebase/messaging";

export function useCloudMessaging(registration: ServiceWorkerRegistration | null) {
  //const fcmInsert = api.fcm.insert.useMutation();
  const notificationsIsGranted = useStore.use.notificationsIsGranted();
  const user = useStore.use.user();

  useEffect(() => {
    if (user && registration && notificationsIsGranted) {
      const messaging = initCloudMessaging(payloadDispatch);
      void getAndSaveToken(messaging, registration);
    }
  }, [user, notificationsIsGranted, registration]);
  return null;
}

async function getAndSaveToken(messaging: Messaging, registration: ServiceWorkerRegistration) {
  try {
    const token = await getFcmToken(messaging, registration);
    const res = await fetch("/api/message/token", {
      method: "POST",
      body: JSONE.stringify({ token }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
