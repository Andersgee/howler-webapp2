import { getUserFromCookie } from "#src/utils/jwt";
import { trpcRouter } from ".";
import { headers } from "next/headers";
import type { Ctx } from "./trpc";
import { cache } from "react";

/*
note about cache(): https://react.dev/reference/react/cache
wrapping apiRsc in cache() means "call it at most once for each server request"
meaning if a page has multiple server components that use apiRsc() we can skip some work.

here apiRsc() isnt actually expensive or slow at all, but why not, best practise and what not.

there is also the option to "preload" eg call apiRsc() somewhere early without awaiting it

again this is "react cache", its not related at all to nextjs client side router cache or nextjs server side data cache
*/

async function createTrpcRscContext() {
  const user = await getUserFromCookie();
  const ctx: Ctx = {
    user: user,
    reqHeaders: headers(),
    resHeaders: null,
  };

  return ctx;
}

/**
 * For server components (or server actions) calling protected (or public) procedures.
 *
 * Will opt route into dynamic rendering since makes use of "dynamic functions" aka `next/headers`.
 *
 * ## Example usage
 *
 * ```ts
 * const { api, user } = await apiRsc();
 * const event = await api.post.getById({ postId });
 * ```
 * */
export const apiRsc = cache(async () => {
  const ctx = await createTrpcRscContext();
  return {
    api: trpcRouter.createCaller(ctx),
    user: ctx.user,
  };
});

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
