import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { dbfetch } from "#src/db";
import { JSONE } from "#src/utils/jsone";

const userInfo = {
  id: "10160546811594270",
  name: "Anders Gustafsson",
  email: "andersgee@gmail.com",
  picture: {
    data: {
      url: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10160546811594270&height=50&width=50&ext=1709411943&hash=AfqUN0cvn6I_K2fjy3GY6q6QcHh17dy1WOX2p_aIFVvL-g",
    },
  },
};
//console.log(userInfo);

async function main() {
  const db = dbfetch();

  const hmm = await db.selectFrom("Event").selectAll().execute();
  console.log(hmm);

  //const r = await db.selectFrom("Event").selectAll().execute();
  //const r = await db.deleteFrom("Notification").execute();

  //const existingUser = await db.selectFrom("User").selectAll().where("email", "=", userInfo.email).executeTakeFirst();

  /*
  const compiledQuery = db
    .insertInto("User")
    .values({
      name: userInfo.name,
      email: userInfo.email,
      facebookdUserId: userInfo.id,
      image: userInfo.picture.data.url,
    })
    .compile();

  const q = JSONE.stringify({
    sql: compiledQuery.sql,
    parameters: compiledQuery.parameters,
  });

  console.log("q:", q);
  console.log("encoded:", encodeURIComponent(q));
  */

  //const r = await db.deleteFrom("Notification").execute();
  //console.log(r);
  return 1;
}

void main();
