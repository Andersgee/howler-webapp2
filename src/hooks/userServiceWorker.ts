import { registerSW } from "#src/utils/service-worker";
import { useEffect, useState } from "react";

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  useEffect(() => {
    registerSW()
      .then(setRegistration)
      .catch(() => {
        console.log("could not registerSW");
      });
  }, []);
  return registration;
}
