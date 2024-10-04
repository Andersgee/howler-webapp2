import { dbfetch } from "#src/db";
//import { absUrl } from "#src/utils/url";
//import { sendCloudMessage } from "./send";
import { webPush } from "#src/lib/web-push";

//import { JSONE } from "#src/utils/jsone";
//import { z } from "zod";
//export const zMessage = z.object({
//  title: z.string(),
//  body: z.string(),
//  relativeLink: z.string(),
//  icon: z.string().optional(),
//  image: z.string().optional(),
//});
//export type Message = z.infer<typeof zMessage>;

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

  const pushSubscriptions = await db
    .selectFrom("PushSubscription")
    .where("userId", "in", userIds)
    .select(["auth_base64url", "p256dh_base64url", "endpoint"])
    .execute();

  for (const pushSubscription of pushSubscriptions) {
    const res = await webPush({ payload: JSON.stringify(message), pushSubscription });
    //TODO: deal with bad responses
    //https://datatracker.ietf.org/doc/html/rfc8030#section-4.1
    //A push service MUST return a 400 (Bad Request) status code for requests that contain an invalid subscription set.
    //actually they return 400 for other things like bad requests in general so this is not correct
    //if (res.status === 400) {
    //  await db.deleteFrom("PushSubscription").where("endpoint", "=", pushSubscription.endpoint).execute();
    //}

    if (!res.ok) {
      if (res.status === 404) {
        await db.deleteFrom("PushSubscription").where("endpoint", "=", pushSubscription.endpoint).execute();
      } else {
        //log this and look here for error logs: https://vercel.com/andyfx/howler-webapp/logs
        const text = await res.text();
        const msg = {
          status: res.status,
          statusText: res.statusText,
          text,
        };

        console.error(JSON.stringify(msg));
        //push subscription has unsubscribed or expired.
      }
    }
  }

  /*
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
    //android: {
    //  notification: {
    //    //does this solve the "click only opens app, instead of opening app to correct url" issue?
    //    //https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#androidnotification
    //    click_action: absUrl(message.relativeLink),
    //  },
    //},
  });
  */
}
