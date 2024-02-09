import { trpcRouter } from ".";
import type { Ctx } from "./trpc";
import { cache } from "react";

/**
 * For server components (or server actions) calling public procedures.
 *
 * Will error on protected procedures.
 *
 * ## Example usage
 *
 * ```ts
 * const { api } = apiRscPublic();
 * const event = await api.post.getById({ postId });
 * ```
 * */
export const apiRscPublic = cache(() => {
  const ctx: Ctx = {
    user: null,
    resHeaders: null,
    reqHeaders: null,
  };
  return {
    api: trpcRouter.createCaller(ctx),
  };
});
