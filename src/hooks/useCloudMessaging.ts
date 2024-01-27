import { initCloudMessaging, getFcmToken } from "#src/lib/cloud-messaging";
import { payloadDispatch } from "#src/store/slices/fcm";
import { useEffect } from "react";
import { api } from "./api";
import { useStore } from "#src/store";

export function useCloudMessaging(registration: ServiceWorkerRegistration | null) {
  const fcmInsert = api.fcm.insert.useMutation();
  const notificationsIsGranted = useStore.use.notificationsIsGranted();
  const user = useStore.use.user();

  useEffect(() => {
    if (user && registration && notificationsIsGranted) {
      const messaging = initCloudMessaging(payloadDispatch);
      getFcmToken(messaging, registration)
        .then((token) => {
          console.log("saving token");
          fcmInsert.mutate({ token });
        })
        .catch(() => {
          //ignore
        });
    }
  }, [user, notificationsIsGranted, registration, fcmInsert]);
  return null;
}
