import { type NextRequest } from "next/server";
import {
  GOOGLE_discoveryDocument,
  GOOGLE_OPENID_DISCOVERY_URL,
  GOOGLE_TOKEN,
  GOOGLE_USERINFO,
} from "#src/utils/auth/schema";
import { getSessionFromRequestCookie, verifyStateToken } from "#src/utils/jwt";
import { absUrl, encodeParams } from "#src/utils/url";
import { createOrUpdateUser } from "../authenticate";
import { errorMessageFromUnkown } from "#src/utils/errormessage";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequestCookie(request);
    if (!session) throw new Error("no session");

    const stateToken = request.nextUrl.searchParams.get("state");
    const code = request.nextUrl.searchParams.get("code");
    if (!stateToken || !code) throw new Error("no session");

    const state = await verifyStateToken(stateToken);
    if (!state) throw new Error("no session");

    // confirm csrf
    if (state.csrf !== session.csrf) throw new Error("no session");

    //const token_endpoint = "https://oauth2.googleapis.com/token";
    const token_endpoint = GOOGLE_discoveryDocument.parse(
      await fetch(GOOGLE_OPENID_DISCOVERY_URL, { cache: "default" }).then((r) => r.json())
    ).token_endpoint;

    // Exchange code for access token and ID token
    // https://developers.google.com/identity/openid-connect/openid-connect#exchangecode
    const token = GOOGLE_TOKEN.parse(
      await fetch(token_endpoint, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeParams({
          code: code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: absUrl("/api/auth/callback/google"),
          grant_type: "authorization_code",
        }),
      }).then((r) => r.json())
    );

    // Obtain user information from the ID token
    // regarding verifying id_token, see https://developers.google.com/identity/openid-connect/openid-connect#obtainuserinfo
    // TLDR; no need to validate since we used client_secret and response came directly from google
    // so just grab the payload part of the Base64-encoded object
    const id_token_payload = token.id_token.split(".")[1];
    if (!id_token_payload) throw new Error("no id token");
    const userInfo = GOOGLE_USERINFO.parse(JSON.parse(Buffer.from(id_token_payload, "base64url").toString()));

    // Authenticate the user
    const { usercookiestring } = await createOrUpdateUser({
      email: userInfo.email,
      name: userInfo.name,
      image: userInfo.picture,
      googleUserSub: userInfo.sub,
    });

    return new Response(null, {
      status: 303,
      headers: {
        "Location": absUrl(state.route),
        "Set-Cookie": usercookiestring,
      },
    });
  } catch (error) {
    console.error(errorMessageFromUnkown(error));

    //might want to go to an error page and show the error
    return new Response(null, {
      status: 303,
      headers: {
        Location: absUrl(),
      },
    });
  }
}
