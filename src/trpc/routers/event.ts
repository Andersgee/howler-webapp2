import { z } from "zod";
import { dbfetch } from "#src/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hashidFromId } from "#src/utils/hashid";
import { type NotNull, sql } from "kysely";
import { zGeoJsonPoint } from "#src/db/types-geojson";
import { tagsEvent } from "./eventTags";
import { revalidateTag } from "next/cache";

export const eventRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ id: z.bigint() })).query(async ({ input }) => {
    return await dbfetch({ next: { tags: [tagsEvent.info(input.id)] } })
      .selectFrom("Event")
      .selectAll()
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();
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
        locationName: z.union([z.literal("").transform(() => null), z.string().trim().min(3).max(55)]),
        //image: z.string().nullish(),
        //imageAspect: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      //console.log("api, input:", input);
      const updateResult = await dbfetch()
        .updateTable("Event")
        .where("id", "=", input.id)
        .where("creatorId", "=", ctx.user.id)
        .set(input)
        .executeTakeFirstOrThrow();

      revalidateTag(tagsEvent.info(input.id));

      return { ...updateResult, hashid: hashidFromId(input.id) };
    }),
  explore: publicProcedure
    .input(
      z.object({
        titleOrLocationName: z.string().trim().max(55),
        minDate: z.date().optional(),
        maxDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const trimmedStr = trimSearchOperators(input.titleOrLocationName);

      const withSearch = trimmedStr.length > 0;

      //I need to show ALL events (that has location) as default scenario
      //to put that default scenario in cache where no filters are applied
      const db = !withSearch && !input.minDate && !input.maxDate ? dbfetch({ next: { revalidate: 10 } }) : dbfetch();

      let q = db
        .selectFrom("Event")
        .select(["id", "location", "locationName", "title"])
        .$if(withSearch, (qb) => {
          const search = searchstring(trimmedStr);
          console.log("search:", search);
          return qb
            .select(sql<number>`MATCH (title,locationName) AGAINST (${search} IN BOOLEAN MODE)`.as("score"))
            .orderBy("score desc");
        })
        .where("location", "is not", null)
        .$narrowType<{ location: NotNull }>(); //for typescript, make location not null

      if (input.minDate) {
        q = q.where("date", ">", input.minDate);
      }
      if (input.maxDate) {
        q = q.where("date", "<", input.maxDate);
      }

      q = q.orderBy("id desc"); //finally order by id desc aka latest created first

      if (withSearch) {
        q = q.limit(5);
      } else {
        //just grab everything I guess, need to show all on map
      }

      //.orderBy("location", sql`IS NULL`).orderBy("location asc") //this is how to do null last
      let events = await q.execute();

      //Im sure its possible to do this conditional filter in the query itself... but this is fine
      if (withSearch) {
        events = events.filter((x) => x.score! > 0);
      }

      return { events, withSearch };
    }),
});

/**
 * some characters have special meaning: https://dev.mysql.com/doc/refman/8.0/en/fulltext-boolean.html
 *
 * remove some characters and whitespacing
 *
 * eg "hello +world)    what-is " => "hello world whatis"
 *
 * note: this is not about sql injection or anything... its just making sure fulltext boolean search string is ok
 *
 * TODO: perhaps allow some special chars? also most likely I should replace "-" with " " instead of ignoring it?
 *
 * there is also a thing to keep in mind that (by default) only 3 letter words (and up) are stored in index
 * and some special words are ignored/not stored in fulltext index (stopword list) because of zero semantic value like "the" or "some"
 * this is editable in stopword_table or can be enabled/disabled with enable_stopword
 */
function trimSearchOperators(str: string) {
  //const operators = ["+", "-", "@", ">", "<", "(", ")", "~", "*", '"'];
  return str
    .replace(/\+|\-|\@|\>|\<|\(|\)|\~|\*|\"/g, "") //remove some special chars
    .trim()
    .split(/(\s+)/) //split whitespace
    .filter((x) => x.trim().length > 0) //and remove whitespace items
    .join(" "); //join with single space
}

function searchstring(str: string) {
  const words = str.split(/(\s+)/).filter((x) => x.trim().length > 0); //split whitespace
  const r = words.join("* ").concat("*"); // ["hel","worl"] => "hel* worl*"
  return `>${r}`; //make first word a bit more important
}

/*
notes: 

.select([
  "title",
  "locationName",
  "id",
  "location",
  sql<number>`MATCH (title,locationName) AGAINST (${search} IN BOOLEAN MODE)`.as("score"),
])

https://dev.mysql.com/doc/refman/8.0/en/fulltext-natural-language.html
natural language mode (default) also sorts in order of decreasing relevance, unless you use some other orderby instruction
q = q.where(sql<SqlBool>`MATCH (title,locationName) AGAINST (${input.titleOrLocationName} IN NATURAL LANGUAGE MODE)`);

natural language mode has optional "query expansion" essentially meaning "run again using most common words in first result, return result of both"
q = q.where(sql<SqlBool>`MATCH (title,locationName) AGAINST (${input.titleOrLocationName} IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION)`);
    
*/
