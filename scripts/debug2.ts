import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { dbfetch, dbTransaction } from "#src/db";

async function main() {
  const db = dbfetch();

  //const p_before = await db.selectFrom("Post").select(["id", "text"]).orderBy("id desc").limit(10).execute();
  //console.log({ p_before });

  const irs = await dbTransaction([
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["1 multi", ["BigInt", "1"]] },
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["2 multi", ["BigInt", "1"]] },
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["3 multi", ["BigInt", "1"]] },
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["4 multi", ["BigInt", "1"]] },
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["4 multi", ["BigIntx", "1"]] },
  ]);
  console.log({ irs });

  /*
  const irs = await dbTransaction([
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["1 good in bad", ["BigInt", "1"]] },
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["2 good in bad", ["BigInt", "1"]] },
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["3 bad in bad", ["xBigInt", "1"]] },
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["4 good in bad", ["BigInt", "1"]] },
    { sql: "INSERT INTO `Post` (text,userId) VALUES (?,?)", parameters: ["5 good in bad", ["BigInt", "1"]] },
  ]);
  console.log({ irs });
  */

  //const a = await dbTransaction([
  //  { sql: "INSERT INTO `Post` (text,userId) ", parameters: ["trx before bad", ["BigInt", "1"]] },
  //  { sql: "INSERT INTO `Post` (text,userId) ", parameters: ["woopido", ["BigInt", "1"]] },
  //]);

  //const p_after = await db.selectFrom("Post").select("id").execute();

  const p_after = await db.selectFrom("Post").select(["id", "text"]).orderBy("id desc").limit(10).execute();
  console.log({ p_after });
}

void main();
