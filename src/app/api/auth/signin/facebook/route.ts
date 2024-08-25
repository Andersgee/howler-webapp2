import { errorMessageFromUnkown } from "#src/utils/errormessage";
import { createStateToken, getSessionFromRequestCookie } from "#src/utils/jwt";
import { absUrl, urlWithSearchparams } from "#src/utils/url";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

/*
https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow/

https://developers.facebook.com/docs/graph-api/reference/user/#fields

1. Create an anti-forgery state token
2. Send an authentication request to Google
3. Confirm the anti-forgery state token
4. Exchange code for access token and ID token
5. Obtain user information from the ID token
6. Authenticate the user 
*/

export async function GET(request: NextRequest) {
  try {
    const route = request.nextUrl.searchParams.get("route") ?? "";

    const session = await getSessionFromRequestCookie(request);
    if (!session) throw new Error("no session");

    const stateToken = await createStateToken({ csrf: session.csrf, route });

    const authorization_endpoint = "https://www.facebook.com/v19.0/dialog/oauth";

    const authRequestUrl = urlWithSearchparams(authorization_endpoint, {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      response_type: "code",
      scope: "email", // "public_profile,email" ?
      redirect_uri: absUrl("/api/auth/callback/facebook"),
      state: stateToken,
    });

    return new Response(null, {
      status: 303,
      headers: {
        Location: authRequestUrl.toString(),
      },
    });
  } catch (error) {
    console.error(errorMessageFromUnkown(error));
    return new Response(null, {
      status: 303,
      headers: {
        Location: absUrl("/err"),
      },
    });
  }
}
