import "dotenv/config";
import "#src/utils/validate-process-env.mjs";

import { dbfetch } from "#src/db";
import { type NotNull } from "kysely";
import { getPlaceholderData } from "#src/lib/image-placeholder";

async function main() {
  const db = dbfetch();

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
    const updateResult = await db.updateTable("Event").where("id", "=", event.id).set({ imageBlurData }).execute();
    console.log(updateResult);
  }
}

void main();
