import { revalidateTag } from "next/cache";
import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { tagsUser } from "./userTags";
import { userCookieRemoveString } from "#src/utils/auth/schema";
import { notify } from "#src/lib/cloud-messaging-light/notify";
import { hashidFromId } from "#src/utils/hashid";
import { afterResponseIsFinished } from "#src/utils/after-response-is-finished";

export const userRouter = createTRPCRouter({
  cookie: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  info: protectedProcedure.input(z.object({ userId: z.bigint() })).query(async ({ input }) => {
    const user = await dbfetch({ next: { tags: [tagsUser.info(input)] } })
      .selectFrom("User")
      .selectAll()
      .where("User.id", "=", input.userId)
      .executeTakeFirstOrThrow();

    return user;
  }),
  infoPublic: publicProcedure.input(z.object({ userId: z.bigint() })).query(async ({ input }) => {
    const user = await dbfetch({ next: { tags: [tagsUser.info(input)] } })
      .selectFrom("User")
      .select(["id", "name", "image"])
      .where("User.id", "=", input.userId)
      .executeTakeFirstOrThrow();

    return user;
  }),
  update: protectedProcedure.input(z.object({ name: z.string() })).query(async ({ input, ctx }) => {
    const _updateResult = await dbfetch()
      .updateTable("User")
      .where("id", "=", ctx.user.id)
      .set({
        name: input.name,
      })
      .executeTakeFirstOrThrow();

    revalidateTag(tagsUser.info({ userId: ctx.user.id }));
    return true;
  }),
  deleteMe: protectedProcedure.mutation(async ({ ctx }) => {
    const _deleteResult = await dbfetch().deleteFrom("User").where("id", "=", ctx.user.id).executeTakeFirstOrThrow();
    ctx.resHeaders?.append("Set-Cookie", userCookieRemoveString());
    return { userId: ctx.user.id };
  }),
  meIsFollowing: protectedProcedure.input(z.object({ id: z.bigint() })).query(async ({ input, ctx }) => {
    const t = tagsUser.isFollowing({ userId: input.id, followerId: ctx.user.id });
    const r = await dbfetch({ next: { tags: [t] } })
      .selectFrom("UserUserPivot")
      .select("userId")
      .where("userId", "=", input.id)
      .where("followerId", "=", ctx.user.id)
      .executeTakeFirst();
    return r ? true : false;
  }),
  followOrUnfollow: protectedProcedure
    .input(z.object({ id: z.bigint(), join: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const t = tagsUser.isFollowing({ userId: input.id, followerId: ctx.user.id });
      const db = dbfetch();
      if (input.join) {
        await db
          .insertInto("UserUserPivot")
          .ignore()
          .values({
            userId: input.id,
            followerId: ctx.user.id,
          })
          .executeTakeFirstOrThrow();
      } else {
        await db
          .deleteFrom("UserUserPivot")
          .where("userId", "=", input.id)
          .where("followerId", "=", ctx.user.id)
          .executeTakeFirstOrThrow();
      }

      afterResponseIsFinished(async () => {
        if (!input.join) return;
        await notify([input.id], {
          title: `${ctx.user.name} followed you`,
          body: `see their profile`,
          relativeLink: `/profile/${hashidFromId(ctx.user.id)}`,
          icon: ctx.user.image,
        });
      });

      revalidateTag(t);
      return t;
    }),
});
