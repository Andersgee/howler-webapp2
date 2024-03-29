import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { sendCloudMessage, sendCloudMessageToTokens } from "#src/lib/cloud-messaging-light/send";

//import { dbfetch } from "#src/db";
//import { getAccessToken } from "#src/lib/cloud-messaging-light/admin";

const test_fcm_token = process.env.ANDERS_PHONE_TEST_FCM_TOKEN!;
if (typeof test_fcm_token !== "string") {
  throw new Error("no process.env.ANDERS_PHONE_TEST_FCM_TOKEN");
}

async function main() {
  //const db = dbfetch();
  //const r = await db.selectFrom("Event").selectAll().execute();
  //console.log(r);
  //const data = await getAccessToken();
  //console.log(data);
  //const cryptoKey = await importPrivateKey(process.env.HOWLER_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY);
  //console.log(cryptoKey);

  const userIds = [BigInt(3)];

  await sendCloudMessageToTokens([test_fcm_token], {
    data: {
      relativeLink: "/event/A6Qbe",
    },
    notification: {
      title: "with musker icon on android",
      body: "some body",
      //image: polylineimg, //keep image small.. JPEG, PNG full support across platforms .. WebP has varying levels of support
    },
    webpush: {
      notification: {
        icon: "https://howler.andyfx.net/icons/favicon-48x48.png", //
        //badge: "https://howler.andyfx.net/icons/favicon-48x48.png", //this was not great, yellow/black bg and without
        //badge: "https://howler.andyfx.net/icons/favicon-maskable-512x512.png", //same here, but even worse.
        //I think badge image should be with transparent background and everyting else will be black. also 96x96 size
        //can prob choose bgcolor somehow
        badge: "https://howler.andyfx.net/icons/badge.png",
      },
      fcm_options: {
        link: "https://howler.andyfx.net/event/A6Qbe", //Mata gravid katt som inte vill gå ut
      },
    },
    //ok this is useless. webapp is not android app? using custom icon here does not do anything
    //android: {
    //  notification: {
    //    //color: "#2563EB", //must be capital letters?
    //    color: "#FF0000",
    //    icon: "https://musker.andyfx.net/icons/favicon.png",
    //  },
    //},
  });
}

void main();
