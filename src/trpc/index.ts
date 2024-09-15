import { createTRPCRouter } from "./trpc";
import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { eventRouter } from "./routers/event";
import { geocodeRouter } from "./routers/geocode";
import { notificationRouter } from "./routers/notification";
import { commentRouter } from "./routers/comment";
import { replyRouter } from "./routers/reply";

export const trpcRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  event: eventRouter,
  geocode: geocodeRouter,
  notification: notificationRouter,
  comment: commentRouter,
  reply: replyRouter,
});

export type TrpcRouter = typeof trpcRouter;
