//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
//undefined locale to use browsers default locale
const OPTIONS_LONG: Intl.DateTimeFormatOptions = { dateStyle: "full", timeStyle: "short", hour12: false };
const OPTIONS: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short", hour12: false };

/** example: `"Wednesday, July 5, 2023 at 13:17"` */
export function prettyDateLong(date: Date, defaultLocale = true) {
  if (defaultLocale) {
    return new Intl.DateTimeFormat(undefined, OPTIONS_LONG).format(date);
  }
  return new Intl.DateTimeFormat("en-US", { ...OPTIONS_LONG, timeZone: "UTC" }).format(date);
}

/** example: `"Jul 5, 2023, 13:17"` */
export function prettyDate(date: Date, defaultLocale = true) {
  if (defaultLocale) {
    return new Intl.DateTimeFormat(undefined, OPTIONS).format(date);
  }
  return new Intl.DateTimeFormat("en-US", { ...OPTIONS, timeZone: "UTC" }).format(date);
}

/**
 * `<input type="datetime-local">` wants a particular string format in local time such as
 *
 * "2021-12-15T20:15"
 *
 * or
 *
 * "2021-12-15T20:15:34"
 *
 * which is almost just date.toISOString() but not quite.
 */
export function datetimelocalString(date: Date, p: "m" | "s" = "m") {
  //const n = p === "s" ? 19 : 16;
  const n = p === "s" ? 19 : 16;
  return localIsoString(date).slice(0, n);
}
function localIsoString(d: Date) {
  const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return date.toISOString();
}
