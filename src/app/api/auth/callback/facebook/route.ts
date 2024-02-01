import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import { tagsUser } from "#src/trpc/routers/userTags";
import { USER_COOKIE_MAXAGE, userCookieString } from "#src/utils/auth/schema";
import { createTokenFromUser, getSessionFromRequestCookie, verifyStateToken } from "#src/utils/jwt";
import type { TokenUser } from "#src/utils/jwt/schema";
import { absUrl, urlWithSearchparams } from "#src/utils/url";
import { dbfetch } from "#src/db";
import { z } from "zod";

/*
https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow/

*/

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

    // Exchange the code for an access token
    const token_endpoint = urlWithSearchparams("https://graph.facebook.com/v19.0/oauth/access_token", {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      redirect_uri: absUrl("/api/auth/callback/facebook"),
      code: code,
    });

    const token = z
      .object({
        access_token: z.string(),
        token_type: z.string(), //"bearer"
        expires_in: z.number(), //5182784
      })
      .parse(
        await fetch(token_endpoint, {
          method: "GET",
          cache: "no-store",
        }).then((r) => r.json())
      );

    // Obtain info about the user for which we now have an access token
    const userinfoUrl = urlWithSearchparams("https://graph.facebook.com/v19.0/me", {
      fields: "id,name,email,picture",
      access_token: token.access_token,
    });
    const userInfo = z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        picture: z.object({
          data: z.object({
            //width: z.number(), //49
            //height: z.number(), //49
            //is_silhouette: z.boolean(),
            url: z.string(), //'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10160546811594270&height=50&width=50&ext=1709410307&hash=Afq3CgjBp7_NgRUycgTHcZioDwb9LPdhRsW4SLgZZM1ZWA',
          }),
        }),
      })
      .parse(
        await fetch(userinfoUrl, {
          method: "GET",
          cache: "no-store",
          //headers: {
          //  Authorization: `${token.token_type} ${token.access_token}`,
          //},
        }).then((r) => r.json())
      );

    // Authenticate the user
    const existingUser = await db.selectFrom("User").selectAll().where("email", "=", userInfo.email).executeTakeFirst();

    console.log("existingUser:", existingUser);

    let tokenUser: TokenUser | undefined = undefined;
    if (existingUser) {
      if (!existingUser.facebookdUserId) {
        await db.updateTable("User").set({ facebookdUserId: userInfo.id }).where("id", "=", existingUser.id).execute();
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
          facebookdUserId: userInfo.id,
          image: userInfo.picture.data.url,
        })
        .executeTakeFirstOrThrow();

      tokenUser = {
        id: insertResult.insertId!,
        name: userInfo.name,
        image: userInfo.picture.data.url,
      };
    }
    revalidateTag(tagsUser.info({ userId: tokenUser.id }));

    const userCookie = await createTokenFromUser(tokenUser);
    return new Response(null, {
      status: 303,
      headers: {
        "Location": absUrl(state.route),
        "Set-Cookie": userCookieString(userCookie, USER_COOKIE_MAXAGE),
      },
    });
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
