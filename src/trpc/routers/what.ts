import { dbfetch } from "#src/db";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { trimSearchOperators } from "./eventSchema";
import { sql } from "kysely";

export const whatRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const db = dbfetch();
    const whats = await db.selectFrom("What").selectAll().execute();

    return whats;
  }),
  search: publicProcedure
    .input(
      z.object({
        title: z.string().trim().max(55),
      })
    )
    .query(async ({ input }) => {
      const trimmedStr = trimSearchOperators(input.title);

      const withSearch = trimmedStr.length > 0;

      const db = withSearch ? dbfetch() : dbfetch({ next: { revalidate: 10 } });

      const search = searchstring(trimmedStr);

      const suggestions = db
        .selectFrom("What")
        .select(["id", "title"])
        .select(sql<number>`MATCH (title) AGAINST (${search} IN BOOLEAN MODE)`.as("score"))
        .orderBy("score desc")
        .orderBy("id desc") //finally order by id desc aka latest created first
        .limit(5)
        .execute();

      return suggestions;
    }),
});

function searchstring(str: string) {
  const words = str.split(/(\s+)/).filter((x) => x.trim().length > 0); //split whitespace
  const r = words.join("* ").concat("*"); // ["hel","worl"] => "hel* worl*"
  return `>${r}`; //make first word a bit more important
}
