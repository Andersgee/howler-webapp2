import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { dbfetch } from "#src/db";

async function main() {
  const db = dbfetch();

  //const r = await db.selectFrom("Event").selectAll().execute();
  const r = await db.deleteFrom("Notification").execute();
  console.log(r);
  return 1;
}

void main();
