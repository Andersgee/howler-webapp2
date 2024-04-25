import { createTRPCRouter } from "./trpc";
import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { eventRouter } from "./routers/event";
import { geocodeRouter } from "./routers/geocode";
import { fcmRouter } from "./routers/fcm";
import { notificationRouter } from "./routers/notification";
import { commentRouter } from "./routers/comment";

export const trpcRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  event: eventRouter,
  geocode: geocodeRouter,
  fcm: fcmRouter,
  notification: notificationRouter,
  comment: commentRouter,
});

export type TrpcRouter = typeof trpcRouter;
