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
