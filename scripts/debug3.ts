import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { dbfetch } from "#src/db";
import { sql } from "kysely";
import { JSONE } from "#src/utils/jsone";

async function main() {
  const db = dbfetch();

  //https://dev.mysql.com/doc/refman/8.0/en/alter-table.html
  //"RENAME INDEX old_index_name TO new_index_name"
  //const r = await sql.raw("SELECT `id`,`imageAspect` FROM Event").execute(db);

  const updateResult = await db.updateTable("Event").set({ imageAspect: 1 }).execute();

  console.log(JSONE.stringify(updateResult, 2));
}

void main();
