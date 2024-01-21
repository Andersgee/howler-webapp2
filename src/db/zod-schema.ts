import * as z from "zod";
import { schemaGeoJSON } from "./geojson-types"

const zTypedArray = z.custom<ArrayBufferView>((value) => ArrayBuffer.isView(value));

// this file here mostly generated as a copy-paste starting point reference for when specifying api inputs
//
// anyway, this is how values of "INSERT" looks from a zod perspective
// but database defaults to NULL for nullable cols if not specifying a value for that col on insert
// so having any .nullable() (aka T | null) as .nullish() (aka T | null | undefined) is also valid for inserts
//
// for "UPDATE" obviously everything is .optional() which also means all .nullable() cols become .nullish()
//
// again, this is just a copy paste starting point for writing input schemas

export const UserEventPivot = z.object({
  userId: z.bigint(),
  eventId: z.bigint(),
  joinDate: z.date().optional(),
});

export const Event = z.object({
  id: z.bigint().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  title: z.string(),
  date: z.date().optional(),
  location: schemaGeoJSON.Point.nullable(),
  creatorId: z.bigint(),
  locationName: z.string().nullable(),
  image: z.string().nullable(),
  imageAspect: z.number().optional(),
});

export const User = z.object({
  id: z.bigint().optional(),
  email: z.string(),
  googleUserSub: z.string().nullable(),
  discordUserId: z.string().nullable(),
  githubUserId: z.number().nullable(),
  image: z.string().nullable(),
  name: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const Post = z.object({
  id: z.bigint().optional(),
  text: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.bigint(),
});

