import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { dbfetch } from "#src/db";

export const fcmRouter = createTRPCRouter({
  insert: protectedProcedure.input(z.object({ token: z.string() })).mutation(async ({ input, ctx }) => {
    const insertResult = await dbfetch()
      .insertInto("FcmToken")
      .ignore()
      .values({
        token: input.token,
        userId: ctx.user.id,
      })
      .executeTakeFirstOrThrow();
    return insertResult;
  }),
});
