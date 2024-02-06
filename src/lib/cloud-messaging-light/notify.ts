import { dbfetch } from "#src/db";
import { absUrl } from "#src/utils/url";
import { sendCloudMessage } from "./send";

export type Message = {
  title: string;
  body: string;
  relativeLink: string;
  icon?: string;
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

  const notificationId = insertResult.insertId!;

  await db
    .insertInto("UserNotificationPivot")
    .values(userIds.map((userId) => ({ userId, notificationId })))
    .execute();

  await sendCloudMessage(userIds, {
    data: {
      id: notificationId.toString(),
      relativeLink: message.relativeLink,
    },
    notification: {
      title: message.title,
      body: message.body,
      image: message.image,
    },
    webpush: {
      notification: {
        icon: message.icon ?? absUrl("/icons/favicon-48.png"),
        badge: absUrl("/icons/badge.png"),
      },
      fcm_options: {
        link: absUrl(message.relativeLink),
      },
    },
  });
}
