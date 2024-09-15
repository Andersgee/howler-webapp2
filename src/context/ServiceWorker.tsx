"use client";

import { serviceWorkerRegister } from "#src/lib/service-worker";
import { atomServiceWorkerRegistration } from "#src/store/jotai/atoms/atom-service-worker-registration";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

//put this below jotai provider
export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const didRun = useRef(false);

  const setServiceWorkerRegistration = useSetAtom(atomServiceWorkerRegistration);
  useEffect(() => {
    if (didRun.current) return; //only run once even in development
    didRun.current = true;

    serviceWorkerRegister()
      .then(setServiceWorkerRegistration)
      .catch(() => {
        console.log("could not registerSW");
      });
  }, [setServiceWorkerRegistration]);
  return children;
}
