import { type NextRequest } from "next/server";
import { GITHUB_AUTHORIZATION_URL } from "#src/utils/auth/schema";
import { createStateToken, getSessionFromRequestCookie } from "#src/utils/jwt";
import { absUrl, urlWithSearchparams } from "#src/utils/url";

export const dynamic = "force-dynamic";
export const runtime = "edge";

/*
https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow
*/

export async function GET(request: NextRequest) {
  try {
    const route = request.nextUrl.searchParams.get("route") ?? "";
    const session = await getSessionFromRequestCookie(request);
    if (!session) throw new Error("no session");

    const stateToken = await createStateToken({ csrf: session.csrf, route });

    const authRequestUrl = urlWithSearchparams(GITHUB_AUTHORIZATION_URL, {
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: absUrl("/api/auth/callback/github"),
      //login: "", //Suggests a specific account to use for signing in and authorizing the app.
      scope: "read:user user:email",
      state: stateToken,
      //allow_signup: "false", //default is true, which allows a person to create an account aswell
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
