import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hashidFromId } from "#src/utils/hashid";
import { schemaCreate, schemaFilter } from "./eventSchema";
import { type SqlBool, sql } from "kysely";

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
      .orderBy("id desc")
      //.where("date",">", new Date())
      .execute();
  }),
  getFiltered: publicProcedure.input(schemaFilter).query(async ({ input }) => {
    let q = dbfetch().selectFrom("Event").select(["id", "location"]);
    if (input.minDate) {
      q = q.where("date", ">", input.minDate);
    }
    if (input.maxDate) {
      q = q.where("date", "<", input.maxDate);
    }
    if (input.titleOrLocationName) {
      //I manually added a fulltext index like so:
      //ALTER TABLE `Event` ADD FULLTEXT `Event_title_locationName_fulltextidx` (`title`, `locationName`)

      //https://dev.mysql.com/doc/refman/8.0/en/fulltext-natural-language.html
      //natural language mode (default) also sorts in order of decreasing relevance
      q = q.where(
        sql<SqlBool>`MATCH (title,locationName) AGAINST (${input.titleOrLocationName} IN NATURAL LANGUAGE MODE)`
      );

      //https://dev.mysql.com/doc/refman/8.0/en/fulltext-boolean.html
      //q = q.where(
      //  sql<SqlBool>`MATCH (title,locationName) AGAINST (${input.titleOrLocationName} IN BOOLEAN MODE)`
      //).orderBy("id desc");
    }

    return await q.execute();
  }),
});
