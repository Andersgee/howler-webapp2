import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { dbfetch } from "#src/db";
import { sql } from "kysely";

async function main() {
  const db = dbfetch();

  //https://dev.mysql.com/doc/refman/8.0/en/alter-table.html
  //"RENAME INDEX old_index_name TO new_index_name"
  const r = await sql
    .raw("ALTER TABLE `Event` RENAME INDEX `Event_title_locationName_fulltextidx` TO `Event_title_locationName_idx`")
    .execute(db);

  console.log({ r });
}

void main();
