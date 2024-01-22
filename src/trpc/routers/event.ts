import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hashidFromId } from "#src/utils/hashid";
import { schemaFilter, splitWhitespace, trimSearchOperators } from "./eventSchema";
import { sql } from "kysely";
import { zGeoJsonPoint, type Point } from "#src/db/geojson-types";
import { revalidateTag } from "next/cache";

const eventTags = {
  info: (id: bigint) => `event-info-${id}`,
};

export const eventRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ id: z.bigint() })).query(async ({ input }) => {
    return await dbfetch({ next: { tags: [eventTags.info(input.id)] } })
      .selectFrom("Event")
      .selectAll()
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();
  }),
  latest: publicProcedure.query(async () => {
    return await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Event")
      .selectAll()
      .orderBy("id desc")
      .limit(10)
      .execute();
  }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(55),
        date: z.date(),
        location: z.union([z.null().transform(() => undefined), zGeoJsonPoint]),
        locationName: z.union([z.literal("").transform(() => undefined), z.string().min(3).max(55)]),
        //image: z.string().nullish(),
        //imageAspect: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const insertResult = await dbfetch()
        .insertInto("Event")
        .values({ ...input, creatorId: ctx.user.id })
        .executeTakeFirstOrThrow();

      return { ...insertResult, hashid: hashidFromId(insertResult.insertId!) };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.bigint(),
        title: z.string().min(3).max(55).optional(),
        date: z.date().optional(),
        location: zGeoJsonPoint.nullish(),
        locationName: z.union([
          z.literal("").transform(() => null),
          z
            .string()
            .trim()
            .min(3, { message: "at least 3 characters (or empty)" })
            .max(55, { message: "at most 55 characters (or empty)" }),
        ]),
        //image: z.string().nullish(),
        //imageAspect: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log("api, input:", input);
      const updateResult = await dbfetch()
        .updateTable("Event")
        .where("id", "=", input.id)
        .where("creatorId", "=", ctx.user.id)
        .set(input)
        .executeTakeFirstOrThrow();

      revalidateTag(eventTags.info(input.id));

      return { ...updateResult, hashid: hashidFromId(input.id) };
    }),

  getAll: publicProcedure.query(async () => {
    return await dbfetch({ next: { revalidate: 10 } })
      .selectFrom("Event")
      .select(["id", "location"])
      .where("location", "is not", null)
      .$narrowType<{ location: Point }>() //for typescript, make location not null
      .orderBy("id desc")
      //.where("date",">", new Date())
      .execute();
  }),
  getExplore: publicProcedure.input(schemaFilter).query(async ({ input }) => {
    const withScore = !!input.titleOrLocationName;

    let q = dbfetch()
      .selectFrom("Event")
      .select(["id", "location", "locationName", "title"])
      .$if(withScore, (qb) => {
        //let search = input.titleOrLocationName!;
        //let search = trimSearchOperators(input.titleOrLocationName!);
        //search = split_whitespace(search).join("* ").concat("*");
        //search = `>${search}`;
        //search = `${search}*`;

        //let search = input.titleOrLocationName!;
        let search = splitWhitespace(input.titleOrLocationName!).join("* ").concat("*");
        search = `>${search}`;
        console.log(`search: '${search}'`);
        return qb
          .select(sql<number>`MATCH (title,locationName) AGAINST (${search} IN BOOLEAN MODE)`.as("score"))
          .orderBy("score desc");
      })
      .where("location", "is not", null)
      .$narrowType<{ location: Point }>(); //for typescript, make location not null

    if (input.minDate) {
      q = q.where("date", ">", input.minDate);
    }
    if (input.maxDate) {
      q = q.where("date", "<", input.maxDate);
    }

    q = q
      .orderBy("id desc") //finally order by id desc aka latest created first
      .limit(5);

    //.orderBy("location", sql`IS NULL`).orderBy("location asc") //this is how to do null last
    let result = await q.execute();

    //Im sure its possible to do this conditional filter in the query itself... but this is fine
    if (withScore) {
      result = result.filter((x) => x.score! > 0);
    }

    return { events: result, withScore };
  }),

  testingfulltext: publicProcedure.input(schemaFilter).query(async ({ input }) => {
    let q = dbfetch().selectFrom("Event").select(["title", "locationName", "id", "location"]);

    if (input.titleOrLocationName) {
      let search = trimSearchOperators(input.titleOrLocationName);
      //TODO: play with actual search string a bit. perhaps add a "<" in front of last word
      //or smth to decrease its contribution since it might be an incomplete word, or add ">" to first word perhaps?..
      //see: https://dev.mysql.com/doc/refman/8.0/en/fulltext-boolean.html
      //search = split_whitespace(search).join("* ").concat("*");
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
