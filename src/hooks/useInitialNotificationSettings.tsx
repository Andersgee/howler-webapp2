"use client";

import { serviceWorkerGetExistingPushSubscription, serviceWorkerRegister } from "#src/lib/service-worker";
import { useEffect, useRef } from "react";
import { useStore } from "#src/store";

export function useInitialNotificationSettings() {
  const setIsSupported = useStore.use.setNotificationIsSupported();
  const setNotificationPermission = useStore.use.setNotificationPermission();
  const serviceWorkerRegistration = useStore.use.serviceWorkerRegistration();
  const setPushSubscription = useStore.use.setPushSubscription();
  const setIsStandalone = useStore.use.setIsStandalone();

  const didRun = useRef(false);

  const setServiceWorkerRegistration = useStore.use.setServiceWorkerRegistration();

  useEffect(() => {
    if (didRun.current) return; //only run once even in development
    didRun.current = true;
    void serviceWorkerRegister().then(setServiceWorkerRegistration);
  }, [setServiceWorkerRegistration]);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      //registerServiceWorker()
    } else {
      setIsSupported(false);
    }
  }, [setIsSupported]);

  //grab existing permission state
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [setNotificationPermission]);

  useEffect(() => {
    if (!serviceWorkerRegistration) return;
    void serviceWorkerGetExistingPushSubscription(serviceWorkerRegistration).then(setPushSubscription);
  }, [serviceWorkerRegistration, setPushSubscription]);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, [setIsStandalone]);

  return null;
}
