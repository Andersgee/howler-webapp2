"use client";

import PlausibleProvider from "next-plausible";
import { useGetSession } from "#src/hooks/useGetSession";
import { TrpcProvider } from "./Trpc";

import { Provider as JotaiProvider } from "jotai";
import { jotaiStore } from "#src/store/jotai";
import { ServiceWorkerProvider } from "./ServiceWorker";

export function Providers({ children }: { children: React.ReactNode }) {
  useGetSession();

  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <TrpcProvider>
        <JotaiProvider store={jotaiStore}>
          <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
        </JotaiProvider>
      </TrpcProvider>
    </PlausibleProvider>
  );
}
