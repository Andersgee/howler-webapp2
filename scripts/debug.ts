import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { dbfetch } from "#src/db";
import { type schemaFilter } from "#src/trpc/routers/eventSchema";
import { type z } from "zod";
import { type SqlBool, sql } from "kysely";

type SchemaFilter = z.infer<typeof schemaFilter>;

async function main() {
  const db = dbfetch();

  const input: SchemaFilter = {
    titleOrLocationName: "pappa maMma har",
  };

  /*
  let q = db.selectFrom("Event").select(["id", "location"]);
  if (input.titleOrLocationName) {
    //https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like
    //q = q.where("title", "like", `%${input.titleOrLocationName}`);
    q = q.where("title","match",input.titleOrLocationName)
  }

  const r = await q.execute();
  */

  //const r = await sql.raw("SELECT * FROM `Event`").execute(db);
  /*
  const addindexres = await sql
    .raw("ALTER TABLE `Event` ADD FULLTEXT `Event_title_locationName_fulltextidx` (`title`, `locationName`)")
    .execute(db);
  console.log({ addindexres });
  return;
  */

  const r1 = await sql
    .raw(
      "SELECT id,location FROM `Event` WHERE MATCH (title,locationName) AGAINST ('pappa maMma har' IN NATURAL LANGUAGE MODE)"
    )
    .execute(db);

  console.log({ r1: r1.rows });

  //const r = await sql.raw("SELECT * FROM `Event` WHERE MATCH (title,locationName) AGAINST ('pappa maMma har' IN NATURAL LANGUAGE MODE)").execute(db);

  let q = dbfetch().selectFrom("Event").select(["id", "location"]);
  if (input.titleOrLocationName) {
    q = q.where(
      sql<SqlBool>`MATCH (title,locationName) AGAINST (${input.titleOrLocationName} IN NATURAL LANGUAGE MODE)`
    );
  }
  const r2 = await q.execute();
  console.log({ r2 });
}

void main();
