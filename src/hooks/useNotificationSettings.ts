import { atomNotificationIsSupported } from "#src/store/jotai/atoms/atom-notification-is-supported";
import { atomNotificationPermission } from "#src/store/jotai/atoms/atom-notification-permissions";
import { atomPushSubscription } from "#src/store/jotai/atoms/atom-push-subscription";
import { atomServiceWorkerRegistration } from "#src/store/jotai/atoms/atom-service-worker-registration";
import { uint8ArrayFromBase64url } from "#src/utils/jsone";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";

export function useNotificationSettings() {
  const [isSupported, setIsSupported] = useAtom(atomNotificationIsSupported);
  const [notificationPermission, setNotificationPermission] = useAtom(atomNotificationPermission);
  //const [serviceWorkerRegistration, setServiceWorkerRegistration] = useAtom(atomServiceWorkerRegistration);
  const serviceWorkerRegistration = useAtomValue(atomServiceWorkerRegistration);
  const [pushSubscription, setPushSubscription] = useAtom(atomPushSubscription);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      //registerServiceWorker()
    }
  }, [setIsSupported]);

  //grab existing permission state
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [setNotificationPermission]);

  //grab existing push subscription (if any)
  useEffect(() => {
    if (serviceWorkerRegistration) {
      void serviceWorkerRegistration.pushManager.getSubscription().then(setPushSubscription);
    }
  }, [serviceWorkerRegistration, setPushSubscription]);

  const requestNotificationPermission = useCallback(async () => {
    if (notificationPermission === "granted") {
      return true;
    } else if (notificationPermission === "denied") {
      return false;
    } else if (notificationPermission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      //actually, just handle this in ui depending on the notificationPermission value
      //if (permission === "denied") {
      //  onDenied();
      //}
    }
  }, [notificationPermission, setNotificationPermission]);

  const pushSubscriptionSubscribe = useCallback(() => {
    if (serviceWorkerRegistration) {
      void serviceWorkerRegistration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: uint8ArrayFromBase64url(process.env.NEXT_PUBLIC_WEBPUSH_APPSERVER_PUBLIC_BASE64URL_RAW),
        })
        .then((sub) => {
          console.log("pushSubscriptionSubscribe, sub:", sub);
          setPushSubscription(sub);
        });
    }
  }, [serviceWorkerRegistration, setPushSubscription]);

  const pushSubscriptionUnSubscribe = useCallback(() => {
    if (pushSubscription) {
      void pushSubscription.unsubscribe().then(() => setPushSubscription(null));
    }
  }, [pushSubscription, setPushSubscription]);

  return {
    isSupported,
    serviceWorkerRegistration,
    notificationPermission,
    requestNotificationPermission,
    pushSubscription,
    pushSubscriptionSubscribe,
    pushSubscriptionUnSubscribe,
  };
}
