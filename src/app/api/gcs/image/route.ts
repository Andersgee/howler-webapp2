import { dbfetch } from "#src/db";
import { deleteImageFromBucket, generateV4UploadSignedUrl } from "#src/lib/cloud-storage";
import { tagsEvent } from "#src/trpc/routers/eventTags";
import { hashidFromId } from "#src/utils/hashid";
import { getUserFromRequestCookie } from "#src/utils/jwt";
import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import sharp from "sharp";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const db = dbfetch();

// alternative image upload.. optimize before storing in bucket
// eg store a 4Mb image as 4kb
// this only works for images smaller than 4.5MB if hosting on vercel.
// since thats the request body size limit to serverless functions

export async function POST(request: NextRequest) {
  const user = await getUserFromRequestCookie(request);
  if (!user) return new Response(null, { status: 401 });

  const params = z
    .object({
      eventId: z.coerce.bigint(),
      contentType: z.enum(["image/png", "image/jpeg"]),
      w: z.coerce.number(),
      h: z.coerce.number(),
    })
    .parse(Object.fromEntries(request.nextUrl.searchParams.entries()));

  const imageAspect = params.w / params.h;

  //make sure user is creator
  const event = await db
    .selectFrom("Event")
    .select(["id", "image"])
    .where("id", "=", params.eventId)
    .where("creatorId", "=", user.id)
    .executeTakeFirstOrThrow();

  //get imagedata and optimize
  const fileBuffer = await request.arrayBuffer();
  const optimizedFileBuffer = await sharp(fileBuffer).resize(Math.min(384, params.w)).webp().toBuffer();

  //pick a filename and get signedurl
  const fileName = `${hashidFromId(event.id)}-${crypto.randomUUID()}`;
  const { signedUploadUrl, imageUrl } = await generateV4UploadSignedUrl(fileName, params.contentType);

  //upload image to bucket, headers must match bucket config
  const bucketres = await fetch(signedUploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": params.contentType,
      "Cache-Control": "public, max-age=2592000",
      "X-Goog-Content-Length-Range": "0,10000000",
    },
    body: optimizedFileBuffer,
  });
  if (!bucketres.ok) throw new Error("could not upload");

  //update image in db
  const _updateResult = await db
    .updateTable("Event")
    .where("id", "=", params.eventId)
    .where("creatorId", "=", user.id)
    .set({
      image: imageUrl,
      imageAspect: imageAspect,
    })
    .executeTakeFirstOrThrow();

  //image is uploaded to bucket and db is updated with new imageUrl
  //maybe delete old image from bucket
  if (event.image) {
    await deleteImageFromBucket(event.image);
  }

  revalidateTag(tagsEvent.info(params.eventId));
  //const ok = updateResult.numUpdatedRows > 0;
  return new Response(imageUrl, { status: 200 });
}
