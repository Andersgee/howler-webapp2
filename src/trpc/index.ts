import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

export const trpcRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
});

export type TrpcRouter = typeof trpcRouter;
