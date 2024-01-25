import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { dbfetch } from "#src/db";
import { type NotNull } from "kysely";
import sharp from "sharp";
import { hashidFromId } from "#src/utils/hashid";
import { getPlaceholderData } from "#src/lib/image-placeholder";

async function main() {
  const db = dbfetch();

  //https://dev.mysql.com/doc/refman/8.0/en/alter-table.html
  //"RENAME INDEX old_index_name TO new_index_name"
  const events = await db
    .selectFrom("Event")
    .select(["id", "image"])
    .where("image", "is not", null)
    .where("imageBlurData", "is", null)
    .$narrowType<{ image: NotNull }>() //for typescript
    .execute();

  console.log(events);

  for (const event of events) {
    const buf = await fetch(event.image).then((res) => res.arrayBuffer());
    const imageBlurData = await getPlaceholderData(buf);

    const updateResult = await db
      .updateTable("Event")
      .where("id", "=", event.id)
      .set({
        imageBlurData,
      })
      .execute();

    console.log(updateResult);
  }

  const hmm = await db
    .selectFrom("Event")
    .select(["id", "imageBlurData"])
    .where("imageBlurData", "is not", null)
    .$narrowType<{ imageBlurData: NotNull }>() //for typescript
    .execute();
  console.log(hmm);
  console.log(hmm.map((x) => hashidFromId(x.id)));

  for (const h of hmm) {
    console.log(`data:image/png;base64,${h.imageBlurData.toString("base64")}`);
  }
}

void main();
