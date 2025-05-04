import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const whatRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const db = dbfetch();
    const whats = await db.selectFrom("What").selectAll().execute();

    return whats;
  }),
});
