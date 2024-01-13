"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpcTransformer } from "#src/trpc/transformer";
import { api } from "#src/hooks/api";
import { baseUrl } from "#src/utils/url";
import { JSONE } from "#src/utils/jsone";

//https://tanstack.com/query/v4/docs/react/guides/important-defaults

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
            //notifyOnChangeProps
            throwOnError: false,
            //select
            //suspense
            //placeholderData
            queryKeyHashFn: (k) => JSONE.stringify(k), //https://github.com/TanStack/query/discussions/2450#discussioncomment-988761
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
