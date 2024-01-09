import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { TrpcRouter } from "#src/trpc";

export const api = createTRPCReact<TrpcRouter>();

/** type utility, example: `type HelloInput = RouterInputs['example']['hello']` */
export type RouterInputs = inferRouterInputs<TrpcRouter>;

/** type utility, example: `type HelloOutput = RouterOutputs['example']['hello']` */
export type RouterOutputs = inferRouterOutputs<TrpcRouter>;
