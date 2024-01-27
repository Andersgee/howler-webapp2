import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { eventRouter } from "./routers/event";
import { createTRPCRouter } from "./trpc";
import { geocodeRouter } from "./routers/geocode";
import { fcmRouter } from "./routers/fcm";

export const trpcRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  event: eventRouter,
  geocode: geocodeRouter,
  fcm: fcmRouter,
});

export type TrpcRouter = typeof trpcRouter;
