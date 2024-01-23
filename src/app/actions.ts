"use server";

import { getUserFromCookie } from "#src/utils/jwt";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

/*
notes about revalidateTag and server actions in general:

calling revalidateTag() in a route handler does not bust the client side router cache immediately
the info will be stale for 30s for dynamic pages (or even 5min for static pages)

so call revalidateTag() in server action after mutations.
I mean at least after mutations that a user would expect to be visible right away like editing a post etc

under the hood, actions are tecnically a POST route aswell, but it can respond with "data and ui"
more precisely, the response is "the relevant rsc payloads" that the client can use to update ui (immediately)

btw Date, bigintm, TypedArray are apparently valid for server action arguments and return values
see list of what "serializable by react" includes here:
https://react.dev/reference/react/use-server#serializable-parameters-and-return-values
the list seems to be same? as when going over boundary from server component -> client component:
https://react.dev/reference/react/use-client#serializable-types
which ofc also includes Date, bigint, TypedArray
*/

export async function actionRevalidateTag(tag: string) {
  const user = await getUserFromCookie();
  if (user) {
    revalidateTag(tag);
  }
}

export async function actionRevalidateTagAndRedirect(tag: string, path: string) {
  const user = await getUserFromCookie();
  if (user) {
    revalidateTag(tag);
    redirect(path);
  }
}

export async function actionRevalidateTags(tags: string[]) {
  const user = await getUserFromCookie();
  if (user) {
    for (const tag of tags) {
      revalidateTag(tag);
    }
  }
}

export async function actionRevalidateTagsAndRedirect(tags: string[], path: string) {
  const user = await getUserFromCookie();
  if (user) {
    for (const tag of tags) {
      revalidateTag(tag);
    }
    redirect(path);
  }
}
