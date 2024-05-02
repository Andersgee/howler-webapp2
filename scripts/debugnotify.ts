import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { notify } from "#src/lib/cloud-messaging-light/notify";
import { dbfetch } from "#src/db";

async function main() {
  const user = await dbfetch()
    .selectFrom("User")
    .where("User.email", "=", "andersgee@gmail.com")
    .selectAll()
    .executeTakeFirstOrThrow();
  console.log(user);

  const userIds = [user.id];
  await notify(userIds, {
    title: `welp1`,
    body: "Test body",
    relativeLink: "/event/R3AxD",
    //icon: user.image ?? undefined,
  });
}

void main();
