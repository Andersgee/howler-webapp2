import type { envSchema } from "../utils/validate-process-env.mjs";
import type { z } from "zod";

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
