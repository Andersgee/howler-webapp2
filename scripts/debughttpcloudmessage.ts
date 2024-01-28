import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { dbfetch } from "#src/db";
import { getAccessToken } from "#src/lib/cloud-messaging/admin-light";

function main() {
  //const db = dbfetch();
  //const r = await db.selectFrom("Event").selectAll().execute();
  //console.log(r);
  //const data = await getAccessToken();
  //console.log(data);
  //const cryptoKey = await importPrivateKey(process.env.HOWLER_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY);
  //console.log(cryptoKey);
}

void main();
