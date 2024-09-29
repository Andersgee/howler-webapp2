import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { webPush } from "#src/lib/web-push";
import { type Message } from "#src/lib/cloud-messaging-light/notify";
import { dbfetch } from "#src/db";

async function main() {
  const userId = BigInt(1);
  const pushSubscription = await dbfetch()
    .selectFrom("PushSubscription")
    .where("userId", "=", userId)
    .select(["auth_base64url", "p256dh_base64url", "endpoint"])
    .executeTakeFirstOrThrow();

  const message: Message = {
    title: "some title 3",
    body: "some body 3",
    relativeLink: "/event/R3AxD",
  };

  const res = await webPush({
    payload: JSON.stringify(message),
    pushSubscription,
  });
  console.log(res);
}

void main();
