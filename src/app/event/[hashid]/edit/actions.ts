"use server";

import { tagsEvent } from "#src/trpc/routers/eventTags";
import { hashidFromId } from "#src/utils/hashid";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/require-await
export async function actionOnSuccess(eventIdString: string) {
  const eventId = BigInt(eventIdString);
  revalidateTag(tagsEvent.info(eventId));
  //redirect(`/event/${hashidFromId(eventId)}`,RedirectType.push); //default in server actions
  redirect(`/event/${hashidFromId(eventId)}`);
}
