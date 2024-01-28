import { dbfetch } from "#src/db";
import { sendTokenMessages } from "#src/lib/cloud-messaging/admin";
import { JSONE } from "#src/utils/jsone";
import { getUserFromRequestCookie } from "#src/utils/jwt";
import { type NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequestCookie(request);
  if (!user) return new Response(null, { status: 401 });

  const body = z.object({ id: z.bigint() }).parse(JSONE.parse(await request.text()));

  const event = await dbfetch()
    .selectFrom("Event")
    .where("Event.id", "=", body.id)
    .where("Event.creatorId", "=", user.id)
    .innerJoin("User", "Event.creatorId", "User.id")
    .select(["Event.title", "User.name as creatorName"])
    .executeTakeFirstOrThrow();

  const fcmTokens = await dbfetch().selectFrom("FcmToken").select("token").where("userId", "=", user.id).execute();
  const myTokens = fcmTokens.map((x) => x.token);
  // 4 KB
  const polylineimg = "https://storage.googleapis.com/howler-event-images/oAxpA-285b680d-c90b-413c-9859-256831437dd5";

  //full list of specification here: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
  const staleTokens = await sendTokenMessages(myTokens, {
    notification: {
      title: `ping from creatorName ${event.creatorName}`,
      body: event.title,
      imageUrl: polylineimg, //keep image small.. JPEG, PNG full support across platforms .. WebP has varying levels of support
    },
    webpush: {
      notification: {
        icon: "https://howler.andyfx.net/icons/favicon-48x48.png", //3.4 KB, could optimize this?
        //vibrate: [200, 100, 200], //https://developer.mozilla.org/en-US/docs/Web/API/Notification/vibrate
      },
      //headers: { image: "someurl" },
      fcmOptions: {
        link: "https://howler.andyfx.net/event/Brv7e",
      },
      data: {
        relativeLink: "/event/Brv7e",
      },
    },
  });
  await dbfetch().deleteFrom("FcmToken").where("token", "in", staleTokens).execute();

  return new Response("hello", { status: 200 });
}
