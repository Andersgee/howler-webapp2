import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { notify } from "#src/lib/cloud-messaging-light/notify";
import { hashidFromId } from "#src/utils/hashid";

export const replyRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.bigint(),
      })
    )
    .query(async ({ input }) => {
      const comment = await dbfetch()
        .selectFrom("Reply")
        .where("Reply.id", "=", input.id)
        .innerJoin("User", "User.id", "Reply.userId")
        .selectAll("Reply")
        .select(["User.image as userImage", "User.name as userName"])
        .executeTakeFirst();

      return comment ?? null;
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3).max(280),
        commentId: z.bigint(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = dbfetch();
      const insertResult = await db
        .insertInto("Reply")
        .values({ ...input, userId: ctx.user.id })
        .executeTakeFirstOrThrow();

      try {
        const comment = await db
          .selectFrom("Comment")
          .select(["userId", "eventId"])
          .where("id", "=", input.commentId)
          .executeTakeFirstOrThrow();
        const notifyUserIds = [comment.userId].filter((id) => id !== ctx.user.id);
        await notify(notifyUserIds, {
          title: `${ctx.user.name} replied to your comment.`,
          body: input.text.length > 55 ? `${input.text.trim().slice(0, 53)}...` : input.text.trim(),
          relativeLink: `/event/${hashidFromId(comment.eventId)}`,
          icon: ctx.user.image,
        });
      } catch (err) {
        console.log(err);
      }

      return insertResult;
    }),
  delete: protectedProcedure.input(z.object({ replyId: z.bigint() })).mutation(async ({ input, ctx }) => {
    const deleteResult = await dbfetch()
      .deleteFrom("Reply")
      .where("id", "=", input.replyId)
      .where("userId", "=", ctx.user.id)
      .executeTakeFirstOrThrow();

    return deleteResult;
  }),
  update: protectedProcedure
    .input(z.object({ commentId: z.bigint(), text: z.string().min(3).max(280) }))
    .mutation(async ({ input, ctx }) => {
      const updateResult = await dbfetch()
        .updateTable("Reply")
        .where("id", "=", input.commentId)
        .where("userId", "=", ctx.user.id)
        .set({ text: input.text })
        .executeTakeFirstOrThrow();

      return updateResult;
    }),
  infinite: publicProcedure
    .input(
      z.object({
        commentId: z.bigint(),
        cursor: z.bigint().optional(),
      })
    )
    .query(async ({ input }) => {
      //await sleep(1000);
      const limit = 10;

      let query = dbfetch()
        .selectFrom("Reply")
        .where("commentId", "=", input.commentId)
        .innerJoin("User", "User.id", "Reply.userId")
        .selectAll("Reply")
        .select(["User.image as userImage", "User.name as userName"])
        .orderBy("Reply.id desc")
        .limit(limit + 1); //one extra to know first item of next page

      if (input.cursor !== undefined) {
        query = query.where("Reply.id", "<=", input.cursor);
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
