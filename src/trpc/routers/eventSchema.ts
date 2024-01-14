import { z } from "zod";
import { schemaPoint } from "#src/db/geojson-types";

export const schemaCreate = z.object({
  title: z
    .string()
    .min(3, { message: "must be at least 3 characters" })
    .max(55, { message: "must be less than 55 characters" }),
  date: z.date().optional(),
  location: schemaPoint.optional(),
  locationName: z.string().min(3, { message: "must be at least 3 characters (or empty)" }).optional().or(z.literal("")),
  who: z.string().min(3, { message: "must be at least 3 characters (or empty)" }).optional().or(z.literal("")),
});

export const schemaFilter = z.object({
  titleOrLocationName: z
    .string()
    .min(3, { message: "must be at least 3 characters" })
    .max(55, { message: "must be less than 55 characters" })
    .optional(),
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
});

/**
 * note: this is not about sql injection or anything...
 * its just that the string has to be well formed.
 */
export function trimSearchOperators(s: string) {
  let search = s.trim();
  const operators = ["+", "-", "@", ">", "<", "(", ")", "~", "*", '"'];
  for (const operator of operators) {
    search = search.replaceAll(operator, "");
  }
  search = split_whitespace(search).join("* ").concat("*");
  return search;
}

function split_whitespace(s: string) {
  return s
    .trim()
    .split(/(\s+)/)
    .filter((x) => x.trim().length > 0);
}
