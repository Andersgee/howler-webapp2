import { type NextRequest } from "next/server";
import { GOOGLE_discoveryDocument, GOOGLE_OPENID_DISCOVERY_URL } from "#src/utils/auth/schema";
import { createStateToken, getSessionFromRequestCookie } from "#src/utils/jwt";
import { absUrl, urlWithSearchparams } from "#src/utils/url";

export const dynamic = "force-dynamic";
export const runtime = "edge";

/*
https://developers.google.com/identity/openid-connect/openid-connect
https://developers.google.com/identity/openid-connect/openid-connect#server-flow

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
    //google prefers you fetch this url instead of hardcoding it
    //const authorization_endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    const authorization_endpoint = GOOGLE_discoveryDocument.parse(
      await fetch(GOOGLE_OPENID_DISCOVERY_URL, { cache: "default" }).then((r) => r.json())
    ).authorization_endpoint;

    //https://developers.google.com/identity/openid-connect/openid-connect#authenticationuriparameters
    const authRequestUrl = urlWithSearchparams(authorization_endpoint, {
      client_id: process.env.GOOGLE_CLIENT_ID,
      response_type: "code",
      scope: "openid email profile",
      redirect_uri: absUrl("/api/auth/callback/google"),
      state: stateToken,
      nonce: crypto.randomUUID(),
    });

    return new Response(undefined, {
      status: 303,
      headers: {
        Location: authRequestUrl.toString(),
      },
    });
  } catch (error) {
    //console.error(errorMessageFromUnkown(error));
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: absUrl(),
      },
    });
  }
}
