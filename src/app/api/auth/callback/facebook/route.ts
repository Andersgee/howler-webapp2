import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import { tagsUser } from "#src/trpc/routers/userTags";
import { USER_COOKIE_MAXAGE, userCookieString } from "#src/utils/auth/schema";
import { createTokenFromUser, getSessionFromRequestCookie, verifyStateToken } from "#src/utils/jwt";
import type { TokenUser } from "#src/utils/jwt/schema";
import { absUrl, encodeParams, urlWithSearchparams } from "#src/utils/url";
import { dbfetch } from "#src/db";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const db = dbfetch();

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

    console.log("request.nextUrl.searchParams:", request.nextUrl.searchParams);

    // Exchange the code for an access token
    const token_endpoint = urlWithSearchparams("https://graph.facebook.com/v19.0/oauth/access_token", {
      client_id: "",
      client_secret: "",
      redirect_uri: absUrl("/api/auth/callback/facebook"),
      code: code,
    });
    const token = z.object({ access_token: z.string(), token_type: z.string(), expires_in: z.coerce.number() }).parse(
      await fetch(token_endpoint, {
        method: "GET",
        cache: "no-store",
      }).then((r) => r.json())
    );

    /*
    GET https://graph.facebook.com/v19.0/oauth/access_token?
   client_id={app-id}
   &redirect_uri={redirect-uri}
   &client_secret={app-secret}
   &code={code-parameter}
    */

    // Obtain info about the user for which we now have an access token

    //get any additional info

    // Authenticate the user
    //const existingUser = await db.selectFrom("User").selectAll().where("email", "=", userInfo.email).executeTakeFirst();

    //insert (or update existing) user in db
    /*
    let tokenUser: TokenUser | undefined = undefined;
    tokenUser = tokenUser!
    
    revalidateTag(tagsUser.info({ userId: tokenUser.id }));

    const userCookie = await createTokenFromUser(tokenUser);

    return new Response(null, {
      status: 303,
      headers: {
        "Location": absUrl(state.route),
        "Set-Cookie": userCookieString(userCookie, USER_COOKIE_MAXAGE),
      },
    });
    */
  } catch (error) {
    //console.error(errorMessageFromUnkown(error));
    return new Response(null, {
      status: 303,
      headers: {
        Location: absUrl(),
      },
    });
  }
}
