"use server";

import { eventTags } from "#src/trpc/routers/eventTags";
import { hashidFromId } from "#src/utils/hashid";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export function actionUpdate(eventIdString: string, _data?: FormData) {
  //await sleep(1000);
  console.log("hello from actionUpdate");
  const eventId = BigInt(eventIdString);
  revalidateTag(eventTags.info(eventId));
  //redirect(`/event/${hashidFromId(eventId)}`,RedirectType.push); //default in server actions
  redirect(`/event/${hashidFromId(eventId)}`);
}
