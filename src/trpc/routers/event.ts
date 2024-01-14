import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hashidFromId } from "#src/utils/hashid";
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
        locationName: input.locationName ? input.locationName : undefined,
      })
      .executeTakeFirstOrThrow();

    return { ...insertResult, hashid: hashidFromId(insertResult.insertId!) };
  }),
  getById: publicProcedure.input(z.object({ id: z.bigint() })).query(async ({ input }) => {
    return await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Event")
      .selectAll()
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();
  }),
  getByIdNumber: publicProcedure
    .input(z.object({ id: z.number(), k: z.date(), r: z.bigint() }))
    .query(async ({ input }) => {
      console.log({ input });
      return await dbfetch({ next: { revalidate: 10 } })
        .selectFrom("Event")
        .selectAll()
        .where("id", "=", BigInt(input.id))
        .executeTakeFirstOrThrow();
    }),
  getAll: publicProcedure.query(async () => {
    return await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Event")
      .select(["id", "location"])
      .where("location", "is not", null)
      .execute();
  }),
});
