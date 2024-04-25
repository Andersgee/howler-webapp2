import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { sleep } from "#src/utils/sleep";

export const commentRouter = createTRPCRouter({
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

      return insertResult;
    }),
  infinite: protectedProcedure
    .input(
      z.object({
        eventId: z.bigint(),
        cursor: z.bigint().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      await sleep(1000);
      const limit = 10;

      let query = dbfetch()
        .selectFrom("Comment")
        .where("eventId", "=", input.eventId)
        .innerJoin("User", "User.id", "Comment.userId")
        .selectAll("Comment")
        .select(["User.image as userImage", "User.name as userName"])
        .orderBy("id desc")
        .limit(limit + 1); //one extra to know first item of next page

      /*
      let query = dbfetch()
        .selectFrom("Notification")
        .innerJoin("UserNotificationPivot", "UserNotificationPivot.notificationId", "Notification.id")
        .select(["Notification.id", "Notification.title", "Notification.body", "Notification.relativeLink"])
        .where("UserNotificationPivot.userId", "=", ctx.user.id)
        .orderBy("Notification.id desc")
        .limit(limit + 1); //one extra to know first item of next page
      */
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
