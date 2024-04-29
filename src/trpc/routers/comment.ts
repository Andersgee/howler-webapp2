import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { sleep } from "#src/utils/sleep";
import { notify } from "#src/lib/cloud-messaging-light/notify";
import { hashidFromId } from "#src/utils/hashid";

export const commentRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.bigint(),
      })
    )
    .query(async ({ input }) => {
      const comment = await dbfetch()
        .selectFrom("Comment")
        .where("Comment.id", "=", input.id)
        .innerJoin("User", "User.id", "Comment.userId")
        .selectAll("Comment")
        .select(["User.image as userImage", "User.name as userName"])
        .executeTakeFirst();

      return comment ?? null;
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3).max(280),
        eventId: z.bigint(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = dbfetch();
      const insertResult = await db
        .insertInto("Comment")
        .values({ ...input, userId: ctx.user.id })
        .executeTakeFirstOrThrow();

      try {
        const event = await db
          .selectFrom("Event")
          .select("creatorId")
          .where("id", "=", input.eventId)
          .executeTakeFirstOrThrow();
        const notifyUserIds = [event.creatorId];
        await notify(notifyUserIds, {
          title: `${ctx.user.name} commented on your howl!`,
          body: input.text.length > 20 ? `${input.text.trim().slice(0, 18)}...` : input.text.trim(),
          relativeLink: `/event/${hashidFromId(input.eventId)}`,
          icon: ctx.user.image,
        });
      } catch (err) {
        console.log(err);
      }

      return insertResult;
    }),
  delete: protectedProcedure.input(z.object({ commentId: z.bigint() })).mutation(async ({ input, ctx }) => {
    const deleteResult = await dbfetch()
      .deleteFrom("Comment")
      .where("id", "=", input.commentId)
      .where("userId", "=", ctx.user.id)
      .executeTakeFirstOrThrow();

    return deleteResult;
  }),
  update: protectedProcedure
    .input(z.object({ commentId: z.bigint(), text: z.string().min(3).max(280) }))
    .mutation(async ({ input, ctx }) => {
      const updateResult = await dbfetch()
        .updateTable("Comment")
        .where("id", "=", input.commentId)
        .where("userId", "=", ctx.user.id)
        .set({ text: input.text })
        .executeTakeFirstOrThrow();

      return updateResult;
    }),
  infinite: publicProcedure
    .input(
      z.object({
        eventId: z.bigint(),
        cursor: z.bigint().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      //await sleep(1000);
      const limit = 10;

      let query = dbfetch()
        .selectFrom("Comment")
        .where("eventId", "=", input.eventId)
        .innerJoin("User", "User.id", "Comment.userId")
        .selectAll("Comment")
        .select(["User.image as userImage", "User.name as userName"])
        .orderBy("id desc")
        .limit(limit + 1); //one extra to know first item of next page

      if (input.cursor !== undefined) {
        query = query.where("Comment.id", "<=", input.cursor);
      }

      const items = await query.execute();

      let nextCursor: bigint | undefined = undefined;
      if (items.length > limit) {
        const firstItemOfNextPage = items.pop()!; //dont return the one extra
        nextCursor = firstItemOfNextPage.id;
      }
      return { items, nextCursor };
    }),
});
