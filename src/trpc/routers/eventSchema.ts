import * as z from "zod";
import { schemaPoint } from "#src/db/geojson-types";

const emptyStringAsUndefined = z.literal("").transform(() => undefined);
const emptyStringAsNull = z.literal("").transform(() => null);

const trimString = (x: unknown) => (typeof x === "string" ? x.trim() : x);

export const schemaCreate = z.object({
  title: z.preprocess(
    trimString,
    z
      .string()
      .min(3, { message: "must be at least 3 characters" })
      .max(55, { message: "must be less than 55 characters" })
  ),
  date: z.date().optional(),
  location: schemaPoint.optional(),
  locationName: z.preprocess(
    trimString,
    z.string().min(3, { message: "must be at least 3 characters (or empty)" }).optional().or(emptyStringAsUndefined)
  ),
  who: z.preprocess(
    trimString,
    z.string().min(3, { message: "must be at least 3 characters (or empty)" }).optional().or(emptyStringAsUndefined)
  ),
});

export const schemaUpdate = z.object({
  id: z.bigint(),
  title: z.preprocess(
    trimString,
    z
      .string()
      .min(3, { message: "must be at least 3 characters" })
      .max(55, { message: "must be less than 55 characters" })
  ),
  date: z.date().optional(),
  location: schemaPoint.optional(),
  locationName: z.preprocess(
    trimString,
    z.string().min(3, { message: "must be at least 3 characters (or empty)" }).optional().or(emptyStringAsNull)
  ),
  who: z.preprocess(
    trimString,
    z.string().min(3, { message: "must be at least 3 characters (or empty)" }).optional().or(emptyStringAsNull)
  ),
});

export const schemaFilter = z.object({
  //titleOrLocationName: z.preprocess(
  //  (x) => (typeof x === "string" ? trimSearchOperators(x) : x),
  //  z
  //    .string()
  //    .min(3, { message: "must be at least 3 characters" })
  //    .max(55, { message: "must be less than 55 characters" })
  //    .optional()
  //    .or(emptyStringAsUndefined)
  //),
  titleOrLocationName: z
    .string()
    .max(55, { message: "must be less than 55 characters" })
    .optional()
    .or(emptyStringAsUndefined),
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
});

/**
 * avoid certain chars in title or locationName
 * note: this is not about sql injection or anything...
 * its just that the string has to be well formed.
 * some characters have special meaning: https://dev.mysql.com/doc/refman/8.0/en/fulltext-boolean.html
 */
function trimSearchOperators_old(s: string) {
  let search = s.trim();
  const operators = ["+", "-", "@", ">", "<", "(", ")", "~", "*", '"'];

  for (const operator of operators) {
    search = search.replaceAll(operator, "");
  }
  search = splitWhitespace(search).join(" ");
  return search;
}

export function splitWhitespace(s: string) {
  return s.split(/(\s+)/).filter((x) => x.trim().length > 0);
}

/**
 * remove some characters and whitespacing
 *
 * eg "hello +world)    what-is " => "hello world whatis"
 * */
export function trimSearchOperators(str: string) {
  //const operators = ["+", "-", "@", ">", "<", "(", ")", "~", "*", '"'];
  return str
    .replace(/\+|\-|\@|\>|\<|\(|\)|\~|\*|\"/g, "") //remove some special chars
    .trim()
    .split(/(\s+)/) //split whitespace
    .filter((x) => x.trim().length > 0) //and remove whitespace items
    .join(" "); //join with single space
}
