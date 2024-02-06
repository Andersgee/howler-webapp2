import { dbfetch } from "#src/db";
import { JSONE } from "#src/utils/jsone";
import { getUserFromRequestCookie } from "#src/utils/jwt";
import { type NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequestCookie(request);
  if (!user) return new Response(null, { status: 401 });

  const input = z.object({ token: z.string() }).parse(JSONE.parse(await request.text()));

  const _insertResult = await dbfetch()
    .insertInto("FcmToken")
    .ignore()
    .values({
      token: input.token,
      userId: user.id,
    })
    .executeTakeFirstOrThrow();

  return new Response(null, { status: 200 });
}
