import { z } from "zod";

// import this file in next.config.mjs to validate process.env at build time
// also update envSchema when changing .env
// this file cant be .ts until next.config supports .ts extension

/**
 * keep this up to date with .env
 *
 * its only purpose is to type the global process.env
 */
export const envSchema = z.object({
  //NODE_ENV: z.enum(["development", "test", "production"]),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  JWT_SECRET: z.string(),
  DATABASE_HTTP_URL: z.string().url(),
  DATABASE_HTTP_AUTH_HEADER: z.string(),
  NEXT_PUBLIC_HASHIDS_SALT: z.string(),
  NEXT_PUBLIC_ABSURL: z.string(),
});

/**
 * @param {z.ZodFormattedError<z.infer<typeof envSchema>>} errors
 */
function formatErrors(errors) {
  return Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value) return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);
}

const parsedSchema = envSchema.safeParse(process.env);

if (!parsedSchema.success) {
  console.error("❌ Invalid env vars:\n", ...formatErrors(parsedSchema.error.format()));
  throw new Error("Invalid environment variables");
}
