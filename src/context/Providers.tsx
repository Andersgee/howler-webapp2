"use client";

import PlausibleProvider from "next-plausible";
import { useGetSession } from "#src/hooks/useGetSession";
import { useInitialNotificationSettings } from "#src/hooks/useInitialNotificationSettings";
import { TrpcProvider } from "./Trpc";

export function Providers({ children }: { children: React.ReactNode }) {
  useGetSession();
  useInitialNotificationSettings();

  return (
    <PlausibleProvider domain="howler.andyfx.net">
      <TrpcProvider>{children}</TrpcProvider>
    </PlausibleProvider>
  );
}
