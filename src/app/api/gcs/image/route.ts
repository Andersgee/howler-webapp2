import { dbfetch } from "#src/db";
import { deleteImageFromBucket, generateV4UploadSignedUrl } from "#src/lib/cloud-storage";
import { hashidFromId } from "#src/utils/hashid";
import { JSONE } from "#src/utils/jsone";
import { getUserFromRequestCookie } from "#src/utils/jwt";
import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import * as z from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const db = dbfetch();

//its convenient to have the user upload directly to bucket with a signed url...
//but why keep a 5Mb image instead of a 5kb image on bucket
//go via this route, optimize it and upload the 6kb

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

  //const eventId = z.coerce.bigint().parse(request.nextUrl.searchParams.get("eventId"));
  //const contentType = z.enum(["image/png", "image/jpeg"]).parse(request.nextUrl.searchParams.get("contentType"));
  //const width = z.coerce.number().parse(request.nextUrl.searchParams.get("w"));
  //const height = z.coerce.number().parse(request.nextUrl.searchParams.get("h"));

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
  const updateResult = await db
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

  //const ok = updateResult.numUpdatedRows > 0;
  return new Response(null, { status: 200 });
}
