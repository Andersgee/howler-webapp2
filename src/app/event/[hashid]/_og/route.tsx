import { apiRscPublic } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";
//export const preferredRegion = ["arn1"];

export async function GET(request: NextRequest) {
  try {
    //const p = JSON.stringify(Object.entries(request.nextUrl.search));
    const hashid = request.nextUrl.searchParams.get("hashid");
    if (!hashid) return new Response(null, { status: 404 }); //actually this is guaranteed to exist

    const id = idFromHashid(hashid);
    if (id === undefined) return new Response(null, { status: 404 });

    const { api } = apiRscPublic();
    const event = await api.event.getById({ id });
    if (!event) return new Response(null, { status: 404 });

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            padding: "50px 200px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "red",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <p>hello1</p>
            <p>world2</p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.log(err);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
