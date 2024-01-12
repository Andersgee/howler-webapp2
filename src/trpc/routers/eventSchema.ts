import { z } from "zod";
import { schemaPoint } from "#src/db/geojson-types";

export const schemaCreate = z.object({
  title: z
    .string()
    .min(2, { message: "must be at least 1 character" })
    .max(55, { message: "must be less than 55 characters" }),
  date: z.date().optional(),
  location: schemaPoint.optional(),
  locationName: z.string().optional(),
});
