import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import { tagsUserRouter } from "#src/trpc/routers/user";
import {
  GOOGLE_discoveryDocument,
  GOOGLE_OPENID_DISCOVERY_URL,
  GOOGLE_TOKEN,
  GOOGLE_USERINFO,
  USER_COOKIE_MAXAGE,
  userCookieString,
} from "#src/utils/auth/schema";
import { createTokenFromUser, getSessionFromRequestCookie, verifyStateToken } from "#src/utils/jwt";
import { type TokenUser } from "#src/utils/jwt/schema";
import { absUrl, encodeParams } from "#src/utils/url";
import { dbfetch } from "#src/db";

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
    const userInfo = GOOGLE_USERINFO.parse(JSON.parse(Buffer.from(id_token_payload, "base64").toString()));

    // Authenticate the user
    const existingUser = await db.selectFrom("User").selectAll().where("email", "=", userInfo.email).executeTakeFirst();

    let tokenUser: TokenUser | undefined = undefined;

    if (existingUser) {
      if (!existingUser.googleUserSub) {
        await db.updateTable("User").set({ googleUserSub: userInfo.sub }).where("id", "=", existingUser.id).execute();
      }

      tokenUser = {
        id: existingUser.id,
        name: existingUser.name,
        image: existingUser.image ?? "",
      };
    } else {
      const insertResult = await db
        .insertInto("User")
        .values({
          name: userInfo.name,
          email: userInfo.email,
          googleUserSub: userInfo.sub,
          image: userInfo.picture,
        })
        .executeTakeFirstOrThrow();

      tokenUser = {
        id: insertResult.insertId!,
        name: userInfo.name,
        image: userInfo.picture,
      };
    }
    revalidateTag(tagsUserRouter.info({ userId: tokenUser.id }));

    const userCookie = await createTokenFromUser(tokenUser);

    return new Response(undefined, {
      status: 303,
      headers: {
        "Location": absUrl(state.route),
        "Set-Cookie": userCookieString(userCookie, USER_COOKIE_MAXAGE),
      },
    });
  } catch (error) {
    //console.error(errorMessageFromUnkown(error));

    //might want to go to an error page and show the error
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: absUrl(),
      },
    });
  }
}
