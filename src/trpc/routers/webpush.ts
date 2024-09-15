import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { webPush } from "#src/lib/web-push/web-push";

export const webpushRouter = createTRPCRouter({
  selftest: protectedProcedure
    .input(
      z.object({
        endpoint: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const res = await webPush(input.endpoint, input.body);
      return await res.text();
    }),
});
