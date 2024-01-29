import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { sendCloudMessage } from "#src/lib/cloud-messaging-light/send";

//import { dbfetch } from "#src/db";
//import { getAccessToken } from "#src/lib/cloud-messaging-light/admin";

async function main() {
  //const db = dbfetch();
  //const r = await db.selectFrom("Event").selectAll().execute();
  //console.log(r);
  //const data = await getAccessToken();
  //console.log(data);
  //const cryptoKey = await importPrivateKey(process.env.HOWLER_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY);
  //console.log(cryptoKey);

  const userIds = [BigInt(3)];

  await sendCloudMessage(userIds, {
    notification: {
      title: "some title 2",
      body: "some body",
      //image: polylineimg, //keep image small.. JPEG, PNG full support across platforms .. WebP has varying levels of support
    },
    webpush: {
      fcm_options: {
        link: "https://howler.andyfx.net/event/Brv7e",
      },
    },
    data: {
      relativeLink: "/event/Brv7e",
    },
  });
}

void main();
