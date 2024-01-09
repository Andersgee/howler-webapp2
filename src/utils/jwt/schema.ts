import { z } from "zod";

export const TokenUserSchema = z.object({
  id: z.bigint(),
  name: z.string(),
  image: z.string(),
});

export type TokenUser = z.infer<typeof TokenUserSchema>;

export const TokenSessionSchema = z.object({
  csrf: z.string(),
});

export type TokenSession = z.infer<typeof TokenSessionSchema>;

export const TokenStateSchema = z.object({
  csrf: z.string(),
  route: z.string(),
});

export type TokenState = z.infer<typeof TokenStateSchema>;
