import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import { schemaCreate } from "./eventSchema";

export const eventRouter = createTRPCRouter({
  latest: publicProcedure.query(async () => {
    return await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Event")
      .selectAll()
      .orderBy("id desc")
      .limit(10)
      .execute();
  }),
  create: protectedProcedure.input(schemaCreate).mutation(async ({ input, ctx }) => {
    const insertResult = await dbfetch()
      .insertInto("Event")
      .values({
        creatorId: ctx.user.id,
        title: input.title,
        date: input.date,
        location: input.location,
      })
      .executeTakeFirstOrThrow();
    console.log("insertResult:", insertResult);
    console.log("typeof insertResult.insertId:", typeof insertResult.insertId);
    const hashid = hashidFromId(insertResult.insertId!);
    console.log("hashid:", hashid);
    const re_insertId = idFromHashid(hashid);
    console.log("re_insertId:", re_insertId);
    console.log("typeof re_insertId:", typeof re_insertId);

    return { ...insertResult, hashid: hashidFromId(insertResult.insertId!) };
  }),
  getById: publicProcedure.input(z.object({ id: z.bigint() })).query(async ({ input }) => {
    return await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Event")
      .selectAll()
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();
  }),
});
