import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { type NotNull, sql } from "kysely";

export const whatRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const db = dbfetch();
    const packs = await db
      .selectFrom("UserPackPivot")
      //.where("userId", "=", ctx.user.id)
      .innerJoin("Pack", "Pack.id", "UserPackPivot.packId")
      .selectAll()
      .select(({ eb }) => [
        eb
          .selectFrom("UserPackPivot")
          .whereRef("Pack.id", "=", "UserPackPivot.packId")
          .select(sql<number>`COUNT(*)`.as("count"))
          .as("memberCount"),
      ])
      .execute();

    return packs;
  }),

  listMy: protectedProcedure.query(async ({ ctx }) => {
    const db = dbfetch();
    const packs = await db
      .selectFrom("UserPackPivot")
      .where("userId", "=", ctx.user.id)
      .innerJoin("Pack", "Pack.id", "UserPackPivot.packId")
      .selectAll()
      .select(({ eb }) => [
        eb
          .selectFrom("UserPackPivot")
          .whereRef("Pack.id", "=", "UserPackPivot.packId")
          .select(sql<number>`COUNT(*)`.as("count"))
          .as("memberCount"),
      ])
      .$narrowType<{ memberCount: NotNull }>() //for typescript
      .execute();

    return packs;
  }),
});
