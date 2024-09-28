"use server";

import { dbfetch } from "#src/db";
import { tagsEvent } from "#src/trpc/routers/eventTags";
import { tagsUser } from "#src/trpc/routers/userTags";
import { USER_COOKIE_NAME } from "#src/utils/auth/schema";
import { getUserFromCookie } from "#src/utils/jwt";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function actionDeleteMyUser() {
  const user = await getUserFromCookie();
  if (user) {
    //make sure to delete images from bucket
    const events = await dbfetch()
      .selectFrom("Event")
      .select(["id", "image"])
      .where("creatorId", "=", user.id)
      //.where("image", "is not", null)
      //.$narrowType<{ image: NotNull }>() //for typescript
      .execute();
    /*
    //so this needs nodejs runtime...
    for (const createdEvent of createdEvents) {
      if (createdEvent.image) {
        await deleteImageFromBucket(createdEvent.image);
      }
    }
    */
    //for now, I think just store the imageUrls of which images should be deleted, for deletion some time later
    //also user does not have to wait for google cloud storage to respond
    const _insertResult = await dbfetch()
      .insertInto("DeletedEventImages")
      .ignore()
      .values(events.filter((x) => x.image !== null).map((x) => ({ image: x.image! })))
      .execute();

    //everything else (for now) is cascading deletes
    const _deleteResult = await dbfetch().deleteFrom("User").where("id", "=", user.id).executeTakeFirstOrThrow();
    //ctx.resHeaders?.append("Set-Cookie", userCookieRemoveString());

    //cookies().delete(USER_COOKIE_NAME); //this did not work
    //unsure about special nextjs cookies() function. prob you must remove using same options, as normally
    //cookies().set(USER_COOKIE_NAME, "null; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0");
    cookies().set(USER_COOKIE_NAME, "null", { path: "/", secure: true, httpOnly: true, sameSite: "lax", maxAge: 0 }); //yep.

    revalidateTag(tagsUser.info({ userId: user.id }));

    //the final thing is purging all deleted events from server side cache
    //imho revalidateTag badly named, it should be called purgeTag or something since that is what it does
    //the refetching will only happen next time something tries to use that tag.
    //https://nextjs.org/docs/app/api-reference/functions/revalidateTag
    for (const event of events) {
      revalidateTag(tagsEvent.info(event.id));
    }

    redirect("/");
  }
}
