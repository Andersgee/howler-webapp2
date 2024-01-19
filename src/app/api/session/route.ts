import { type NextRequest } from "next/server";
import { createSessionToken, getSessionFromRequestCookie, getUserFromRequestCookie } from "#src/utils/jwt";
import { sessionCookieString } from "#src/utils/auth/schema";
import { JSONE } from "#src/utils/jsone";

/*
https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies

cookie prefixes are not technically needed but makes the browser assert some things about the cookie to even accept it.
"__Host-" is the strongest assertion: secure and only for this domain.

not setting "Max-Age" or "Expires" makes it a session cookie aka deleted when browser determines "session ends". 
(side note: the particular browser chooses when "session ends" and there might be session restoration going on)

both SameSite=Lax and SameSite=Strict only sends cookie with requests to this domain and nowhere else.
but SameSite=Strict also requires that the request itself comes from this domain.
*/

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequestCookie(request);
  if (user) return new Response(JSONE.stringify(user), { status: 200 });

  const session = await getSessionFromRequestCookie(request);
  if (session) return new Response(null, { status: 204 });

  const sessionToken = await createSessionToken();
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": sessionCookieString(sessionToken),
    },
  });
}
