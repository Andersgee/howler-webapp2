"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpcTransformer } from "#src/trpc/transformer";
import { api } from "#src/hooks/api";
import { baseUrl } from "#src/utils/url";
import { JSONE } from "#src/utils/jsone";

//https://tanstack.com/query/v5/docs/react/guides/important-defaults

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            enabled: true,
            staleTime: Infinity,
            refetchInterval: false,
            refetchIntervalInBackground: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retryOnMount: true,
            throwOnError: false,
            //notifyOnChangeProps,
            //the default JSON.sringify will error on anything without .toJSON() method. like bigint or typed arrays etc
            queryKeyHashFn: (k) => JSONE.stringify(k),
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: trpcTransformer,
      links: [
        httpBatchLink({
          url: baseUrl("/api/trpc"),
        }),
      ],
    })
  );
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
