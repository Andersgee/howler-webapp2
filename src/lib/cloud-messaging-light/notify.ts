import { dbfetch } from "#src/db";
import { JSONE } from "#src/utils/jsone";
import { absUrl } from "#src/utils/url";
import { sendCloudMessage } from "./send";

export type Message = {
  title: string;
  body: string;
  relativeLink: string;
  image?: string;
};

/** with defaults relevant to this app */
export async function notify(userIds: bigint[], message: Message) {
  if (userIds.length === 0) return;

  //make sure to save notification in db
  const db = dbfetch();
  const insertResult = await db
    .insertInto("Notification")
    .values({
      title: message.title,
      body: message.body,
      relativeLink: message.relativeLink,
    })
    .executeTakeFirstOrThrow();

  await db
    .insertInto("UserNotificationPivot")
    .values(
      userIds.map((userId) => ({
        userId,
        notificationId: insertResult.insertId!,
      }))
    )
    .execute();

  await sendCloudMessage(userIds, {
    data: {
      id: insertResult.insertId!.toString(),
      relativeLink: message.relativeLink,
    },
    notification: {
      title: message.title,
      body: message.body,
      image: message.image,
    },
    webpush: {
      notification: {
        icon: absUrl("/icons/favicon-48.png"),
        badge: absUrl("/icons/badge.png"),
      },
      fcm_options: {
        link: absUrl(message.relativeLink),
      },
    },
  });
}
