"use client";

import PlausibleProvider from "next-plausible";
import { useGetSession } from "#src/hooks/useGetSession";
import { TrpcProvider } from "./Trpc";
import { useServiceWorker } from "#src/hooks/useServiceWorker";
import { Provider as JotaiProvider } from "jotai";
import { jotaiStore } from "#src/store/jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  useGetSession();
  const registration = useServiceWorker();
  //useCloudMessaging(registration);
  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <TrpcProvider>
        <JotaiProvider store={jotaiStore}>{children}</JotaiProvider>
      </TrpcProvider>
    </PlausibleProvider>
  );
}
