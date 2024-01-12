import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { eventRouter } from "./routers/event";
import { createTRPCRouter } from "./trpc";
import { geocodeRouter } from "./routers/geocode";

export const trpcRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  event: eventRouter,
  geocode: geocodeRouter,
});

export type TrpcRouter = typeof trpcRouter;
