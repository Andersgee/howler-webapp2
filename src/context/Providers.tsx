"use client";

import { useGetSession } from "#src/hooks/useGetSession";
import { TrpcProvider } from "./Trpc";

export function Providers({ children }: { children: React.ReactNode }) {
  useGetSession();
  return <TrpcProvider>{children}</TrpcProvider>;
}
