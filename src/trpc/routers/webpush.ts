import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { webPush } from "#src/lib/web-push";
import { dbfetch } from "#src/db";

export const webpushRouter = createTRPCRouter({
  myPushSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    return await dbfetch()
      .selectFrom("PushSubscription")
      .select(["endpoint"])
      .where("userId", "=", ctx.user.id)
      .execute();
  }),

  selftest: publicProcedure
    .input(
      z.object({
        payload: z.string(),
        pushSubscription: z.object({
          endpoint: z.string(),
          auth_base64url: z.string(),
          p256dh_base64url: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      //return { hello: "world" };

      const res = await webPush({
        payload: input.payload,
        pushSubscription: input.pushSubscription,
      });
      const text = await res.text();

      return {
        text,
        status: res.status,
        resHeaders: JSON.stringify(res.headers),
        resHeaderLocation: res.headers.get("Location"), //spec said info should be here where it plants to deliver to
      };
    }),

  subscribe: protectedProcedure
    .input(z.object({ auth_base64url: z.string(), p256dh_base64url: z.string(), endpoint: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await dbfetch()
        .insertInto("PushSubscription")
        .values({ ...input, userId: ctx.user.id })
        .execute();

      return true;
    }),

  unsubscribe: protectedProcedure.input(z.object({ endpoint: z.string() })).mutation(async ({ ctx, input }) => {
    await dbfetch()
      .deleteFrom("PushSubscription")
      .where("userId", "=", ctx.user.id)
      .where("endpoint", "=", input.endpoint)
      .execute();

    return true;
  }),
});
