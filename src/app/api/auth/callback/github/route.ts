import { type NextRequest } from "next/server";
import {
  GITHUB_EMAILINFO,
  GITHUB_EMAILS_URL,
  GITHUB_TOKEN,
  GITHUB_TOKEN_URL,
  GITHUB_USERINFO,
  GITHUB_USERINFO_URL,
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

    // Exchange the code for an access token
    const token = GITHUB_TOKEN.parse(
      await fetch(GITHUB_TOKEN_URL, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json", //ask for json (by default response is just a "search params string")
        },
        body: encodeParams({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: absUrl("/api/auth/callback/github"),
        }),
      }).then((res) => res.json())
    );

    // Obtain info about the user for which we now have an access token
    const userInfo = GITHUB_USERINFO.parse(
      await fetch(GITHUB_USERINFO_URL, {
        cache: "no-store",
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
      }).then((res) => res.json())
    );

    //userInfo.email might not be public...
    //but we can fetch it from githubs users/email rest api
    if (!userInfo.email) {
      const emailInfo = GITHUB_EMAILINFO.parse(
        await fetch(GITHUB_EMAILS_URL, {
          headers: { Authorization: `${token.token_type} ${token.access_token}` },
        }).then((res) => res.json())
      );
      userInfo.email = emailInfo.find((e) => e.primary)?.email ?? emailInfo[0]?.email;
      //userInfo.email = (emailInfo.find((e) => e.primary) ?? emailInfo[0]).email;
      if (!userInfo.email) throw new Error("no email");
    }

    //userInfo.name might not be set by user on their github profile, but userInfo.login is always there
    if (!userInfo.name) {
      userInfo.name = userInfo.login;
    }

    // Authenticate the user
    const { usercookiestring } = await createOrUpdateUser({
      email: userInfo.email,
      name: userInfo.name,
      image: userInfo.avatar_url,
      githubUserId: userInfo.id,
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

    return new Response(null, {
      status: 303,
      headers: {
        Location: absUrl(),
      },
    });
  }
}
