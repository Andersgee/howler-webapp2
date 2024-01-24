"use server";

import { dbfetch } from "#src/db";
import { tagsUser } from "#src/trpc/routers/userTags";
import { USER_COOKIE_NAME } from "#src/utils/auth/schema";
import { getUserFromCookie } from "#src/utils/jwt";
import { type NotNull } from "kysely";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function actionDeleteMyUser() {
  const user = await getUserFromCookie();
  if (user) {
    //make sure to delete images from bucket
    const createdEventImages = await dbfetch()
      .selectFrom("Event")
      .select("image")
      .where("creatorId", "=", user.id)
      .where("image", "is not", null)
      .$narrowType<{ image: NotNull }>() //for typescript
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
    const r = await dbfetch().insertInto("DeletedEventImages").ignore().values(createdEventImages).execute();

    //everything else should be cascading deletes from deleting the User
    const _deleteResult = await dbfetch().deleteFrom("User").where("id", "=", user.id).executeTakeFirstOrThrow();
    //ctx.resHeaders?.append("Set-Cookie", userCookieRemoveString());
    cookies().delete(USER_COOKIE_NAME);

    revalidateTag(tagsUser.info({ userId: user.id }));
    redirect("/");
  }
}
