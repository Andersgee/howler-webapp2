import { type NextRequest } from "next/server";
import { DISCORD_TOKEN, DISCORD_TOKEN_URL, DISCORD_USERINFO, DISCORD_USERINFO_URL } from "#src/utils/auth/schema";
import { getSessionFromRequestCookie, verifyStateToken } from "#src/utils/jwt";
import { absUrl, encodeParams } from "#src/utils/url";
import { createOrUpdateUser } from "../authenticate";

export const dynamic = "force-dynamic";
export const runtime = "edge";

//https://discord.com/developers/docs/topics/oauth2
//https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information
//https://discord.com/developers/docs/resources/user#user-object

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
    const token = DISCORD_TOKEN.parse(
      await fetch(DISCORD_TOKEN_URL, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodeParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: absUrl("/api/auth/callback/discord"),
        }),
      }).then((res) => res.json())
    );

    // Obtain info about the user for which we now have an access token
    const userInfo = DISCORD_USERINFO.parse(
      await fetch(DISCORD_USERINFO_URL, {
        cache: "no-store",
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
      }).then((res) => res.json())
    );

    // we dont get an image url from discord, we get an "avatar" string which is just an image id.
    // get the image url instead which is at `https://cdn.discordapp.com/avatars/[user_id]/[user_avatar].png`
    // see https://discord.com/developers/docs/reference#image-formatting-cdn-endpoints
    if (!userInfo.avatar) {
      const defaultAvatarNumber = parseInt(userInfo.discriminator) % 5;
      userInfo.avatar = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    } else {
      const format = userInfo.avatar.startsWith("a_") ? "gif" : "png";
      userInfo.avatar = `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.${format}`;
    }

    // Authenticate the user
    const { usercookiestring } = await createOrUpdateUser({
      email: userInfo.email,
      name: userInfo.username,
      image: userInfo.avatar,
      discordUserId: userInfo.id,
    });

    return new Response(null, {
      status: 303,
      headers: {
        "Location": absUrl(state.route),
        "Set-Cookie": usercookiestring,
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
