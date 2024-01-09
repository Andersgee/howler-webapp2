import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { ZodError } from "zod";
import type { NextRequest } from "next/server";
import { transformer } from "./transformer";
import { getUserFromRequestCookie } from "#src/utils/jwt";
import type { TokenUser } from "#src/utils/jwt/schema";

export type Ctx = {
  user: TokenUser | null;
  reqHeaders: Headers | null;
  resHeaders: Headers | null;
};

export async function createTrpcContext(opts: FetchCreateContextFnOptions, nextRequest: NextRequest): Promise<Ctx> {
  const user = await getUserFromRequestCookie(nextRequest);
  //const session = await getSessionFromRequestCookie(nextRequest)

  return {
    user,
    reqHeaders: nextRequest.headers,
    resHeaders: opts.resHeaders,
  };
}

const t = initTRPC.context<typeof createTrpcContext>().create({
  transformer: transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const middleware = t.middleware;

const hasUser = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

const hasResHeaders = middleware(({ ctx, next }) => {
  if (ctx.resHeaders === null) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { ...ctx, resHeaders: ctx.resHeaders } });
});

// for convenience
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(hasUser);
export const procedureWithResHeaders = t.procedure.use(hasResHeaders);
