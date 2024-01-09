import { type NextRequest, NextResponse } from "next/server";

import { createSessionToken, getSessionFromRequestCookie, getUserFromRequestCookie } from "#src/utils/jwt";
import { sessionCookieString } from "#src/utils/auth/schema";
import { transformer } from "#src/db/transformer";

/*
https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

cookie prefixes are not technically needed but makes the browser assert some things about the cookie to even accept it.
"__Host-" is the strongest assertion: secure and only for this domain.

not setting "Max-Age" or "Expires" makes it a session cookie aka deleted when browser determines "session ends". 
(side note: the particula browser chooses when "session ends" and there might be session restoration going on)

SameSite Lax and Strict only sends cookie with requests to this domain and nowhere else.
but Strict also requires that the request itself comes from this domain.
*/

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequestCookie(request);
  if (user) return NextResponse.json(transformer.serialize(user), { status: 200 });

  const session = await getSessionFromRequestCookie(request);
  if (session) return new Response(undefined, { status: 204 });

  const sessionToken = await createSessionToken();
  return new Response(undefined, {
    status: 204,
    headers: {
      "Set-Cookie": sessionCookieString(sessionToken),
    },
  });
}
