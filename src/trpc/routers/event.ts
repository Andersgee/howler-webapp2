import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hashidFromId } from "#src/utils/hashid";
import { schemaCreate, schemaFilter, schemaUpdate, split_whitespace, trimSearchOperators } from "./eventSchema";
import { sql } from "kysely";
import { type GeoJSON } from "#src/db/geojson-types";

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
  update: protectedProcedure.input(schemaUpdate).mutation(async ({ input, ctx }) => {
    const updateResult = await dbfetch()
      .updateTable("Event")
      .where("id", "=", input.id)
      .where("creatorId", "=", ctx.user.id)
      .set(input)
      .executeTakeFirstOrThrow();

    return { ...updateResult, hashid: hashidFromId(input.id) };
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
      .$narrowType<{ location: GeoJSON["Point"] }>() //for typescript, make location not null
      .orderBy("id desc")
      //.where("date",">", new Date())
      .execute();
  }),
  getExplore: publicProcedure.input(schemaFilter).query(async ({ input }) => {
    const withScore = !!input.titleOrLocationName;
    const result = await dbfetch()
      .selectFrom("Event")
      .select(["id", "location", "locationName", "title"])
      .$if(withScore, (qb) => {
        let search = trimSearchOperators(input.titleOrLocationName!);
        search = split_whitespace(search).join("* ").concat("*");
        search = `>${search}`;
        return qb
          .select(sql<number>`MATCH (title,locationName) AGAINST (${search} IN BOOLEAN MODE)`.as("score"))
          .orderBy("score desc");
      })
      .where("location", "is not", null)
      .$narrowType<{ location: GeoJSON["Point"] }>() //for typescript, make location not null
      .$if(!!input.minDate, (qb) => {
        return qb.where("date", ">", input.minDate!);
      })
      .$if(!!input.maxDate, (qb) => {
        return qb.where("date", "<", input.maxDate!);
      })
      //.orderBy("location", sql`IS NULL`).orderBy("location asc") //this is how to do null last
      .orderBy("id desc") //finally order by id desc aka latest created first
      .limit(10)
      .execute();

    return { events: result, withScore };
  }),

  getFiltered: publicProcedure.input(schemaFilter).query(async ({ input }) => {
    let q = dbfetch().selectFrom("Event").select(["title", "locationName", "id", "location"]);

    if (input.titleOrLocationName) {
      let search = trimSearchOperators(input.titleOrLocationName);
      //TODO: play with actual search string a bit. perhaps add a "<" in front of last word
      //or smth to decrease its contribution since it might be an incomplete word, or add ">" to first word perhaps?..
      //see: https://dev.mysql.com/doc/refman/8.0/en/fulltext-boolean.html
      search = split_whitespace(search).join("* ").concat("*");
      search = `>${search}`;

      q = q
        .select(sql<number>`MATCH (title,locationName) AGAINST (${search} IN BOOLEAN MODE)`.as("score"))
        .orderBy("score desc");
    }
    if (input.minDate) {
      q = q.where("date", ">", input.minDate);
    }
    q = q.orderBy("id desc").limit(10);

    return await q.execute();

    /*
    if (input.titleOrLocationName) {
      let search = trimSearchOperators(input.titleOrLocationName);
      search = split_whitespace(search).join("* ").concat("*");

      return await dbfetch()
        .selectFrom("Event")
        .select([
          "title",
          "locationName",
          "id",
          "location",
          sql<number>`MATCH (title,locationName) AGAINST (${search} IN BOOLEAN MODE)`.as("score"),
        ])
        .orderBy("score desc")
        .orderBy("id desc")
        .limit(10)
        .execute();
    } else {
      return await dbfetch()
        .selectFrom("Event")
        .select(["title", "locationName", "id", "location"])
        .orderBy("id desc")
        .limit(10)
        .execute();
    }
    */

    //I manually added a fulltext index like so:
    //ALTER TABLE `Event` ADD FULLTEXT `Event_title_locationName_fulltextidx` (`title`, `locationName`)

    //https://dev.mysql.com/doc/refman/8.0/en/fulltext-natural-language.html
    //natural language mode (default) also sorts in order of decreasing relevance, unless you use some other orderby instruction
    //q = q.where(sql<SqlBool>`MATCH (title,locationName) AGAINST (${input.titleOrLocationName} IN NATURAL LANGUAGE MODE)`);

    //natural language mode has optional "query expansion" essentially meaning "run again using most common words in first result, return result of both"
    //q = q.where(sql<SqlBool>`MATCH (title,locationName) AGAINST (${input.titleOrLocationName} IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION)`);
  }),
});
