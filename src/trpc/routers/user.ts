import { revalidateTag } from "next/cache";
import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { tagsUser } from "./userTags";

export const userRouter = createTRPCRouter({
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
});
