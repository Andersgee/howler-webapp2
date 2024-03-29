import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { ZodError } from "zod";
import type { NextRequest } from "next/server";
import { trpcTransformer } from "./transformer";
import { getUserFromRequestCookie } from "#src/utils/jwt";
import type { TokenUser } from "#src/utils/jwt/schema";
import { dbfetch } from "#src/db";

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
  transformer: trpcTransformer,
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

const isAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const user = await dbfetch().selectFrom("User").select("role").where("id", "=", ctx.user.id).executeTakeFirst();
  if (user?.role !== "ADMIN") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// for convenience
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(hasUser);
export const adminProcedure = t.procedure.use(isAdmin);
export const procedureWithResHeaders = t.procedure.use(hasResHeaders);
