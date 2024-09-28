import { base64urlFromUint8Array, uint8ArrayFromBase64url } from "#src/utils/jsone";
import { useCallback, useState } from "react";
import { api } from "./api";
import { useStore } from "#src/store";

export function useNotificationSettings() {
  const isSupported = useStore.use.notificationIsSupported();
  const isStandalone = useStore.use.isStandalone();
  const notificationPermission = useStore.use.notificationPermission();
  const setNotificationPermission = useStore.use.setNotificationPermission();
  const serviceWorkerRegistration = useStore.use.serviceWorkerRegistration();
  const pushSubscription = useStore.use.pushSubscription();
  const setPushSubscription = useStore.use.setPushSubscription();

  const utils = api.useUtils();
  const { mutate: webpushSubscribe } = api.webpush.subscribe.useMutation({
    onSettled: () => void utils.webpush.myPushSubscriptions.invalidate(),
  });
  const { mutate: webpushUnsubscribe } = api.webpush.unsubscribe.useMutation({
    onSettled: () => void utils.webpush.myPushSubscriptions.invalidate(),
  });

  const requestNotificationPermission = useCallback(async () => {
    if (notificationPermission === "granted") {
      return true;
    } else if (notificationPermission === "denied") {
      return false;
    } else if (notificationPermission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  }, [notificationPermission, setNotificationPermission]);

  const [pushSubscriptionSubscribeLoading, setLoadingSub] = useState(false);
  const pushSubscriptionSubscribe = useCallback(() => {
    if (serviceWorkerRegistration) {
      setLoadingSub(true);
      void serviceWorkerRegistration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: uint8ArrayFromBase64url(process.env.NEXT_PUBLIC_WEBPUSH_APPSERVER_PUBLIC_BASE64URL_RAW),
        })
        .then((sub) => {
          const auth = sub.getKey("auth");
          const p256dh = sub.getKey("p256dh");

          if (auth !== null && p256dh !== null) {
            setPushSubscription(sub);
            webpushSubscribe({
              auth_base64url: base64urlFromUint8Array(new Uint8Array(auth)),
              p256dh_base64url: base64urlFromUint8Array(new Uint8Array(p256dh)),
              endpoint: sub.endpoint,
            });
          }
        })
        .finally(() => {
          setLoadingSub(false);
        });
    }
  }, [serviceWorkerRegistration, setPushSubscription, webpushSubscribe]);

  const [pushSubscriptionUnSubscribeLoading, setLoadingUnsub] = useState(false);
  const pushSubscriptionUnSubscribe = useCallback(() => {
    if (pushSubscription) {
      setLoadingUnsub(true);
      webpushUnsubscribe({ endpoint: pushSubscription.endpoint });
      void pushSubscription
        .unsubscribe()
        .then(() => {
          setPushSubscription(null);
        })
        .finally(() => {
          setLoadingUnsub(false);
        });
    }
  }, [pushSubscription, setPushSubscription, webpushUnsubscribe]);

  return {
    pushSubscriptionUnSubscribeLoading,
    pushSubscriptionSubscribeLoading,
    isSupported,
    isStandalone,
    serviceWorkerRegistration,
    notificationPermission,
    requestNotificationPermission,
    pushSubscription,
    pushSubscriptionSubscribe,
    pushSubscriptionUnSubscribe,
  };
}
