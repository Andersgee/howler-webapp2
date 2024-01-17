import { dbfetch } from "#src/db";
import { deleteImageFromBucket, generateV4UploadSignedUrl } from "#src/lib/cloud-storage";
import { hashidFromId } from "#src/utils/hashid";
import { JSONE } from "#src/utils/jsone";
import { getUserFromRequestCookie } from "#src/utils/jwt";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

//get signedUrl allowing upload to bucket
export async function GET(request: NextRequest) {
  const user = await getUserFromRequestCookie(request);
  if (!user) return NextResponse.json("Unauthorized", { status: 401 });

  const eventId = BigInt(z.string().min(1).parse(request.nextUrl.searchParams.get("eventId")));
  const contentType = z.enum(["image/png", "image/jpeg"]).parse(request.nextUrl.searchParams.get("contentType"));

  //make sure user is creator, todo: what if there already is an image?
  const { id } = await dbfetch()
    .selectFrom("Event")
    .select("id")
    .where("id", "=", eventId)
    .where("creatorId", "=", user.id)
    .executeTakeFirstOrThrow();
  const fileName = hashidFromId(id); //use same name for image as event because.. why not

  const { signedUploadUrl, imageUrl } = await generateV4UploadSignedUrl(fileName, contentType);
  return NextResponse.json({ signedUploadUrl, imageUrl }, { status: 200 });
}

//delete image from bucket and event
export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequestCookie(request);
  if (!user) return NextResponse.json("Unauthorized", { status: 401 });

  const eventId = BigInt(z.string().min(1).parse(request.nextUrl.searchParams.get("eventId")));

  //make sure user is creator and image exist
  const { image } = await dbfetch()
    .selectFrom("Event")
    .select("image")
    .where("id", "=", eventId)
    .where("creatorId", "=", user.id)
    .where("image", "is not", null)
    .executeTakeFirstOrThrow();

  const ok = await deleteImageFromBucket(image);
  return NextResponse.json({ ok }, { status: 200 });
}
