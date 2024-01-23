import { dbfetch } from "#src/db";
import { deleteImageFromBucket, generateV4UploadSignedUrl } from "#src/lib/cloud-storage";
import { tagsEvent } from "#src/trpc/routers/eventTags";
import { hashidFromId } from "#src/utils/hashid";
import { JSONE } from "#src/utils/jsone";
import { getUserFromRequestCookie } from "#src/utils/jwt";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

//get signedUrl allowing user to upload directly to bucket
//send eventId as the id.toString() here
export async function GET(request: NextRequest) {
  const user = await getUserFromRequestCookie(request);
  if (!user) return NextResponse.json("Unauthorized", { status: 401 });

  const params = z
    .object({
      eventId: z.coerce.bigint(),
      contentType: z.enum(["image/png", "image/jpeg"]),
    })
    .parse(Object.fromEntries(request.nextUrl.searchParams.entries()));

  //make sure user is creator
  const event = await dbfetch()
    .selectFrom("Event")
    .select("id")
    .where("id", "=", params.eventId)
    .where("creatorId", "=", user.id)
    .executeTakeFirstOrThrow();

  const fileName = `${hashidFromId(event.id)}-${crypto.randomUUID()}`;

  const { signedUploadUrl, imageUrl } = await generateV4UploadSignedUrl(fileName, params.contentType);

  return NextResponse.json({ signedUploadUrl, imageUrl }, { status: 200 });
}

//after user has uploaded directly to bucket, they must post here to replace image url in db
//also make sure to delete image from bucket
//it might be worth thinking about optimizing the saved image in bucket? before upload? after upload? on client side?
//if client side we could actually use dynamic import and not import "sharp" until needed,
//I think that might be the way to go. nope. cant use sharp in browser.
export async function POST(request: NextRequest) {
  const user = await getUserFromRequestCookie(request);
  if (!user) return NextResponse.json("Unauthorized", { status: 401 });
  //await request.json()

  const { eventId, imageUrl, imageAspect } = z
    .object({ eventId: z.bigint(), imageUrl: z.string(), imageAspect: z.number() })
    .parse(JSONE.parse(await request.text()));

  //make sure user is creator and grab old image url
  const oldEvent = await dbfetch()
    .selectFrom("Event")
    .select(["id", "image"])
    .where("id", "=", eventId)
    .where("creatorId", "=", user.id)
    .executeTakeFirstOrThrow();

  //make sure user is creator and update image
  const updateResult = await dbfetch()
    .updateTable("Event")
    .where("id", "=", eventId)
    .where("creatorId", "=", user.id)
    .set({ image: imageUrl, imageAspect })
    .executeTakeFirstOrThrow();

  //now that new image url is in db. delete image from bucket
  //it should be available via next/image way longer than the potential 10s or whatever Im server side caching event info
  //in fact its gonna be available for 30 days because thats what I set as max age on bucket responses
  //and next/image uses that and does not refetch/reoptimize until that time is up
  //I remember that next/image does not quite guarantee to never refetch the image, regions etc?
  //but anyway, tldr: its fine to remove the image from bucket right away.
  if (oldEvent.image) {
    await deleteImageFromBucket(oldEvent.image);
  }
  revalidateTag(tagsEvent.info(eventId));
  const ok = updateResult.numUpdatedRows > 0;
  return NextResponse.json({ ok }, { status: 200 });
}
