import { type NextRequest } from "next/server";
import { userCookieString } from "#src/utils/auth/schema";
import { absUrl } from "#src/utils/url";

export const dynamic = "force-dynamic";
export const runtime = "edge";

// remove cookies by setting a new cookie with same exact parameters but Max-Age 0
export function GET(request: NextRequest) {
  const route = request.nextUrl.searchParams.get("route") ?? "";
  return new Response(undefined, {
    status: 303,
    headers: {
      "Location": absUrl(route),
      "Set-Cookie": userCookieString("null", 0),
    },
  });
}
