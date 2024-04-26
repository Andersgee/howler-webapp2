import { dbfetch } from "#src/db";
import { tagsUser } from "#src/trpc/routers/userTags";
import { USER_COOKIE_MAXAGE, userCookieString } from "#src/utils/auth/schema";
import { createTokenFromUser } from "#src/utils/jwt";
import type { TokenUser } from "#src/utils/jwt/schema";
import { revalidateTag } from "next/cache";

type Info = {
  email: string;
  name: string;
  image: string;
  googleUserSub?: string;
  discordUserId?: string;
  facebookdUserId?: string;
  githubUserId?: number;
};

export async function createOrUpdateUser(info: Info) {
  const db = dbfetch();
  const existingUser = await db.selectFrom("User").selectAll().where("email", "=", info.email).executeTakeFirst();

  let tokenUser: TokenUser | undefined = undefined;

  if (existingUser) {
    //actually, update info even if already existing... they might have changed profile pic (on facebook or whatever)
    await db
      .updateTable("User")
      .set({
        //email: info.email,
        name: info.name,
        image: info.image,
        googleUserSub: info.googleUserSub,
        discordUserId: info.discordUserId,
        facebookdUserId: info.facebookdUserId,
        githubUserId: info.githubUserId,
      })
      .where("id", "=", existingUser.id)
      .execute();

    tokenUser = {
      id: existingUser.id,
      name: existingUser.name,
      image: existingUser.image ?? "",
    };
  } else {
    const insertResult = await db
      .insertInto("User")
      .values({
        email: info.email,
        name: info.name,
        image: info.image,
        googleUserSub: info.googleUserSub,
        discordUserId: info.discordUserId,
        facebookdUserId: info.facebookdUserId,
        githubUserId: info.githubUserId,
      })
      .executeTakeFirstOrThrow();

    tokenUser = {
      id: insertResult.insertId!,
      name: info.name,
      image: info.image,
    };
  }
  revalidateTag(tagsUser.info({ userId: tokenUser.id }));

  const userCookie = await createTokenFromUser(tokenUser);
  const usercookiestring = userCookieString(userCookie, USER_COOKIE_MAXAGE);
  return { usercookiestring };
}
