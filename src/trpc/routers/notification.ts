import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { sleep } from "#src/utils/sleep";

export const notificationRouter = createTRPCRouter({
  //get10: protectedProcedure.input(z.object({ userId: z.bigint() })).query(async ({ input, ctx }) => {
  //  const notifications = await dbfetch()
  //    .selectFrom("Notification")
  //    .innerJoin("UserNotificationPivot", "UserNotificationPivot.notificationId", "Notification.id")
  //    .select(["Notification.id", "Notification.title", "Notification.body", "Notification.relativeLink"])
  //    .where("UserNotificationPivot.userId", "=", ctx.user.id)
  //    .orderBy("Notification.id desc")
  //    .limit(10)
  //    .execute();
  //
  //  return notifications;
  //}),
  infinite: protectedProcedure
    .input(
      z.object({
        cursor: z.bigint().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      await sleep(1000);
      const limit = 10;

      let query = dbfetch()
        .selectFrom("Notification")
        .innerJoin("UserNotificationPivot", "UserNotificationPivot.notificationId", "Notification.id")
        .select(["Notification.id", "Notification.title", "Notification.body", "Notification.relativeLink"])
        .where("UserNotificationPivot.userId", "=", ctx.user.id)
        .orderBy("Notification.id desc")
        .limit(limit + 1); //one extra to know first item of next page

      if (input.cursor !== undefined) {
        query = query.where("Notification.id", "<=", input.cursor);
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
