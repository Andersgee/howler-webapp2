import { serviceWorkerRegister } from "#src/lib/service-worker";
import { useEffect, useState } from "react";

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  useEffect(() => {
    serviceWorkerRegister()
      .then(setRegistration)
      .catch(() => {
        console.log("could not registerSW");
      });
  }, []);
  return registration;
}
