"use client";

import { useCloudMessaging } from "#src/hooks/useCloudMessaging";
import { useGetSession } from "#src/hooks/useGetSession";
import { useServiceWorker } from "#src/hooks/userServiceWorker";
import { TrpcProvider } from "./Trpc";

export function Providers({ children }: { children: React.ReactNode }) {
  useGetSession();
  const registration = useServiceWorker();
  useCloudMessaging(registration);
  return <TrpcProvider>{children}</TrpcProvider>;
}
