import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { maybeSleepAndThrow, sleep } from "#src/utils/sleep";

export const postRouter = createTRPCRouter({
  latest: publicProcedure.query(async () => {
    const posts = await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Post")
      .innerJoin("User", "User.id", "Post.userId")
      .selectAll("Post")
      .select(["User.image as userImage", "User.name as userName"])
      .orderBy("id", "desc")
      .limit(10)
      .execute();

    return posts;
  }),
  mylatest: protectedProcedure.query(async ({ ctx }) => {
    const posts = await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Post")
      .innerJoin("User", "User.id", "Post.userId")
      .selectAll("Post")
      .select(["User.image as userImage", "User.name as userName"])
      .where("userId", "=", ctx.user.id)
      .orderBy("id", "desc")
      .limit(10)
      .execute();

    return posts;
  }),
  create: protectedProcedure.input(z.object({ text: z.string() })).mutation(async ({ input, ctx }) => {
    await maybeSleepAndThrow();
    const db = dbfetch();

    const insertResult = await db
      .insertInto("Post")
      .values({
        text: input.text,
        userId: ctx.user.id,
      })
      .executeTakeFirstOrThrow();

    const createdPost = await db
      .selectFrom("Post")
      .innerJoin("User", "User.id", "Post.userId")
      .selectAll("Post")
      .select(["User.image as userImage", "User.name as userName"])
      .where("Post.id", "=", insertResult.insertId!)
      .executeTakeFirstOrThrow();

    return createdPost;
  }),
  update: protectedProcedure
    .input(z.object({ postId: z.bigint(), text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = dbfetch();

      await db
        .updateTable("Post")
        .where("id", "=", input.postId)
        .where("userId", "=", ctx.user.id)
        .set({
          text: input.text,
        })
        .executeTakeFirstOrThrow();

      const updatedPost = db
        .selectFrom("Post")
        .innerJoin("User", "User.id", "Post.userId")
        .selectAll("Post")
        .select(["User.image as userImage", "User.name as userName"])
        .where("Post.id", "=", input.postId)
        .executeTakeFirst();

      return updatedPost ?? null;
    }),

  delete: protectedProcedure.input(z.object({ postId: z.bigint() })).mutation(async ({ input, ctx }) => {
    const deleteResult = await dbfetch()
      .deleteFrom("Post")
      .where("id", "=", input.postId)
      .where("userId", "=", ctx.user.id)
      .executeTakeFirstOrThrow();

    return deleteResult.numDeletedRows > 0;
  }),

  infinitePosts: publicProcedure
    .input(
      z.object({
        cursor: z.bigint().optional(),
      })
    )
    .query(async ({ input }) => {
      await sleep(1000);
      const limit = 5;

      let query = dbfetch()
        .selectFrom("Post")
        .selectAll()
        .orderBy("id", "desc")
        .limit(limit + 1); //one extra to know first item of next page

      if (input.cursor !== undefined) {
        query = query.where("id", "<=", input.cursor);
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
