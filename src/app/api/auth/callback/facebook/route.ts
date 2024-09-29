import { type NextRequest } from "next/server";
import { getSessionFromRequestCookie, verifyStateToken } from "#src/utils/jwt";
import { absUrl, urlWithSearchparams } from "#src/utils/url";
import { z } from "zod";
import { createOrUpdateUser } from "../authenticate";
import { errorMessageFromUnkown } from "#src/utils/errormessage";

/*
https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow/

*/

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: NextRequest) {
  //jow the f did sate.route become "#_=_"
  try {
    //console.log("facebook callback,params", request.nextUrl.searchParams.toString());

    //ok thes only has "code"

    const error_reason = request.nextUrl.searchParams.get("error_reason");
    //if the user didnt accept etc YOUR_REDIRECT_URI?error_reason=user_denied&error=access_denied&error_description=Permissions+error.
    if (error_reason) {
      //ok "cancel" made it into here
      console.error("callback facebook sign in not ok, params:", request.nextUrl.searchParams.toString());
    }

    const session = await getSessionFromRequestCookie(request);
    if (!session) throw new Error("no session");

    const stateToken = request.nextUrl.searchParams.get("state");
    const code = request.nextUrl.searchParams.get("code"); //this exists
    if (!stateToken || !code) throw new Error("no session");

    const state = await verifyStateToken(stateToken);
    if (!state) throw new Error("no session");

    //console.log("DEBUG, stateToken:", stateToken);
    //console.log("DEBUG, state:", state);

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

    //console.log("DEBUG, token:", token);

    // Obtain info about the user for which we now have an access token
    const userinfoUrl = urlWithSearchparams("https://graph.facebook.com/v19.0/me", {
      fields: "id,name,email,picture",
      access_token: token.access_token,
    });
    const userInfoRes = await fetch(userinfoUrl, {
      method: "GET",
      cache: "no-store",
      //headers: {
      //  Authorization: `${token.token_type} ${token.access_token}`,
      //},
    });

    //console.log("DEBUG, userInfoRes:", userInfoRes);

    //const userInfoJson = await userInfoRes.json();
    //console.log("DEBUG, userInfoJson:", userInfoJson);

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
      .parse(await userInfoRes.json());

    //console.log("DEBUG, userInfo:", userInfo);

    // Authenticate the user
    const { usercookiestring } = await createOrUpdateUser({
      email: userInfo.email,
      name: userInfo.name,
      image: userInfo.picture.data.url,
      facebookdUserId: userInfo.id,
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
