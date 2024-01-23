import { z } from "zod";
import { zGeoJsonPoint } from "#src/db/types-geojson";

export const schemaCreate = z.object({
  title: z
    .string()
    .transform((x) => x.trim())
    .pipe(
      z
        .string()
        .min(3, { message: "must be at least 3 characters" })
        .max(55, { message: "must be less than 55 characters" })
    ),
  date: z.date().optional(),
  location: zGeoJsonPoint.optional(),
  locationName: z
    .string()
    .transform((s) => {
      const r = s.trim();
      return r === "" ? undefined : r;
    })
    .pipe(z.string().min(3, { message: "must be at least 3 characters (or empty)" }).optional()),
  //who: z
  //  .string()
  //  .transform((s) => {
  //    const r = s.trim();
  //    return r === "" ? undefined : r;
  //  })
  //  .pipe(z.string().min(3, { message: "must be at least 3 characters (or empty)" }).optional()),
  who: z
    .string()
    .optional()
    .transform(() => undefined), //didnt add "who" to db yet
});

//for client side form, dont change type with transforms
export const schemaFormUpdate = z.object({
  id: z.bigint(),
  //same input/ouput: string
  title: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .min(3, { message: "must be at least 3 characters" })
        .max(55, { message: "must be less than 55 characters" })
    ),
  //same input/ouput: Date
  date: z.date(),
  //same input/ouput: point | null
  location: zGeoJsonPoint.nullable(),
  //same input/ouput: string
  locationName: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(3, { message: "must be at least 3 characters (or empty)" }).or(z.literal(""))),
  //same input/ouput: string
  who: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(3, { message: "must be at least 3 characters (or empty)" }).or(z.literal(""))),
});

//for api, without messages and transform empty string to null for nullable cols
export const schemaUpdate = z.object({
  id: z.bigint(),
  //input: string | undefined
  title: z
    .string()
    .optional()
    .transform((x) => {
      return typeof x === "string" ? x.trim() : x;
    })
    .pipe(z.string().min(3).max(55).optional()),
  //input: Date, output Data | undefined
  date: z.date().optional(),
  //input: point | null | undefined
  location: zGeoJsonPoint.nullish(),
  //input: string | undefined, output string | null | undefined
  locationName: z
    .string()
    .optional()
    .transform((x) => {
      return typeof x === "string" ? x.trim() : x;
    })
    .pipe(
      z
        .string()
        .min(3)
        .optional()
        .or(z.literal("").transform(() => null))
    ),
  //input: string | undefined, output string | null | undefined
  //who: z
  //  .string()
  //  .optional()
  //  .transform((x) => {
  //    return typeof x === "string" ? x.trim() : x;
  //  })
  //  .pipe(
  //    z
  //      .string()
  //      .min(3)
  //      .optional()
  //      .or(z.literal("").transform(() => null))
  //  ),

  who: z
    .string()
    .optional()
    .transform(() => undefined), //didnt add "who" to db yet
});

export const schemaFilter = z.object({
  titleOrLocationName: z
    .string()
    .transform((s) => {
      const r = trimSearchOperators(s);
      return r === "" ? undefined : r;
    })
    .pipe(
      z
        .string()
        .min(3, { message: "must be at least 3 characters" })
        .max(55, { message: "must be less than 55 characters" })
        .optional()
    ),
  minDate: z.date().optional(),
  maxDate: z.date().optional(),
});

export function splitWhitespace(s: string) {
  return s.split(/(\s+)/).filter((x) => x.trim().length > 0);
}

/**
 * some characters have special meaning: https://dev.mysql.com/doc/refman/8.0/en/fulltext-boolean.html
 *
 * remove some characters and whitespacing
 *
 * eg "hello +world)    what-is " => "hello world whatis"
 *
 * note: this is not about sql injection or anything... its just making sure fulltext boolean search string is ok
 *
 * TODO: perhaps allow some special chars? also most likely I should replace "-" with " " instead of ignoring it?
 *
 * there is also a thing to keep in mind that (by default) only 3 letter words (and up) are stored in index
 * and some special words are ignored/not stored in fulltext index (stopword list) because of zero semantic value like "the" or "some"
 * this is editable in stopword_table or can be enabled/disabled with enable_stopword
 */
export function trimSearchOperators(str: string) {
  //const operators = ["+", "-", "@", ">", "<", "(", ")", "~", "*", '"'];
  return str
    .replace(/\+|\-|\@|\>|\<|\(|\)|\~|\*|\"/g, "") //remove some special chars
    .trim()
    .split(/(\s+)/) //split whitespace
    .filter((x) => x.trim().length > 0) //and remove whitespace items
    .join(" "); //join with single space
}
