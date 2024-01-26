/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { zGeoJson } from "./types-geojson";

const zTypedArray = z.custom<Uint8Array>((value) => value instanceof Uint8Array);

// this file here mostly generated as a copy-paste starting point reference for when specifying api inputs
// anyway, this is how values of "INSERT" and "UPDATE" looks from a zod perspective

export const schema_insert_Event = z.object({
  id: z.bigint().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  title: z.string(),
  date: z.date().optional(),
  location: zGeoJson.Point.nullish(),
  creatorId: z.bigint(),
  locationName: z.string().nullish(),
  image: z.string().nullish(),
  imageAspect: z.number().optional(),
  imageBlurData: zTypedArray.nullish(),
});
export const schema_update_Event = z.object({
  id: z.bigint().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  title: z.string().optional(),
  date: z.date().optional(),
  location: zGeoJson.Point.nullish(),
  creatorId: z.bigint().optional(),
  locationName: z.string().nullish(),
  image: z.string().nullish(),
  imageAspect: z.number().optional(),
  imageBlurData: zTypedArray.nullish(),
});

export const schema_insert_DeletedEventImages = z.object({
  image: z.string(),
});
export const schema_update_DeletedEventImages = z.object({
  image: z.string().optional(),
});

export const schema_insert_UserEventPivot = z.object({
  userId: z.bigint(),
  eventId: z.bigint(),
  joinDate: z.date().optional(),
});
export const schema_update_UserEventPivot = z.object({
  userId: z.bigint().optional(),
  eventId: z.bigint().optional(),
  joinDate: z.date().optional(),
});

export const schema_insert_User = z.object({
  id: z.bigint().optional(),
  email: z.string(),
  googleUserSub: z.string().nullish(),
  discordUserId: z.string().nullish(),
  githubUserId: z.number().nullish(),
  image: z.string().nullish(),
  name: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  role: z.enum(["USER","ADMIN"]).optional(),
});
export const schema_update_User = z.object({
  id: z.bigint().optional(),
  email: z.string().optional(),
  googleUserSub: z.string().nullish(),
  discordUserId: z.string().nullish(),
  githubUserId: z.number().nullish(),
  image: z.string().nullish(),
  name: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  role: z.enum(["USER","ADMIN"]).optional(),
});

export const schema_insert_Post = z.object({
  id: z.bigint().optional(),
  text: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.bigint(),
});
export const schema_update_Post = z.object({
  id: z.bigint().optional(),
  text: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.bigint().optional(),
});

