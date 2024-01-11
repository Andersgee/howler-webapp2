import { z } from "zod";
import { schemaPoint } from "#src/db/geojson-types";

export const schemaCreate = z.object({
  title: z.string().max(55, { message: "max 55 characters" }),
  date: z.date().optional(),
  location: schemaPoint.optional(),
});
