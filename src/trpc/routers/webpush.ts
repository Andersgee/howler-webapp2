import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
//import { webPush } from "#src/lib/web-push/web-push";

export const webpushRouter = createTRPCRouter({
  selftest: protectedProcedure
    .input(
      z.object({
        endpoint: z.string(),
        body: z.string(),
      })
    )
    .mutation(({ input }) => {
      return { hello: "world" };
      /*
      const res = await webPush(input.endpoint, input.body);
      const text = await res.text();

      return {
        text,
        status: res.status,
        resHeaders: JSON.stringify(res.headers),
        resHeaderLocation: res.headers.get("Location"), //spec said info should be here where it plants to deliver to
      };
      */
    }),
});
