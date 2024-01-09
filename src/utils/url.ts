/**
 * `new URL()` with encodeURIComponent() on searchParams
 */
export function urlWithSearchparams(url: string, params: Record<string, string | number | boolean>) {
  const u = new URL(url);
  u.search = encodeParams(params);
  return u;
}

export function encodeParams(params: Record<string, string | number | boolean>) {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

/**
 * utility for absolute url from relative urls such as "/about"
 *
 * (for either server or client environment)
 *
 * uses process.env.NEXT_PUBLIC_ABSURL
 */
export function absUrl(url = "") {
  const path = url === "/" ? "" : url;
  return `${process.env.NEXT_PUBLIC_ABSURL}${path}`;
}

/**
 * use this instead of `absUrl()` if browser should use relative url but server should use absolute
 */
export function baseUrl(url = "") {
  if (typeof window !== "undefined") return url;
  return absUrl(url);
}
