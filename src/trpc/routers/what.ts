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
  search: protectedProcedure
    .input(
      z.object({
        title: z.string().trim().max(55),
      })
    )
    .query(async ({ input, ctx }) => {
      const trimmedStr = trimSearchOperators(input.title);

      const withSearch = trimmedStr.length > 0;

      if (withSearch) {
        const db = dbfetch();

        const search = searchstring(trimmedStr);

        const suggestions = await db
          .selectFrom("What")
          .select(["id", "title"])
          .select(sql<number>`MATCH (title) AGAINST (${search} IN BOOLEAN MODE)`.as("score"))
          .orderBy("score desc")
          .orderBy("id desc") //finally order by id desc aka latest created first
          .limit(10)
          .execute();

        return suggestions.filter((x) => x.score > 0);
      } else {
        const db = dbfetch({ next: { revalidate: 10 } });

        //suggest any title of any joined event as default? seems reasonable
        const relevantMaybe = await db
          .selectFrom("UserEventPivot")
          .where("userId", "=", ctx.user.id)
          .innerJoin("Event", "Event.id", "UserEventPivot.eventId")
          .select(["Event.id as eventId", "Event.title"])
          .orderBy("UserEventPivot.joinDate desc") //most recently joined first
          .limit(10)
          .execute();

        const defaultSuggestions = relevantMaybe.map((x) => ({
          id: x.eventId,
          title: x.title,
          score: 0,
        }));
        return defaultSuggestions;
      }
    }),
});

function searchstring(str: string) {
  const words = str.split(/(\s+)/).filter((x) => x.trim().length > 0); //split whitespace
  const r = words.join("* ").concat("*"); // ["hel","worl"] => "hel* worl*"
  return `>${r}`; //make first word a bit more important
}
