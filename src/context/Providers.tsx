"use client";

import PlausibleProvider from "next-plausible";
import { useGetSession } from "#src/hooks/useGetSession";
import { TrpcProvider } from "./Trpc";
//import { useCloudMessaging } from "#src/hooks/useCloudMessaging";
//import { useServiceWorker } from "#src/hooks/userServiceWorker";

export function Providers({ children }: { children: React.ReactNode }) {
  useGetSession();
  //const registration = useServiceWorker();
  //useCloudMessaging(registration);
  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <TrpcProvider>{children}</TrpcProvider>
    </PlausibleProvider>
  );
}
