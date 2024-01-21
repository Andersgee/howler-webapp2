import { type NextRequest } from "next/server";
import { userCookieRemoveString } from "#src/utils/auth/schema";
import { absUrl } from "#src/utils/url";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export function GET(request: NextRequest) {
  const route = request.nextUrl.searchParams.get("route") ?? "";
  return new Response(null, {
    status: 303,
    headers: {
      "Location": absUrl(route),
      "Set-Cookie": userCookieRemoveString(),
    },
  });
}
