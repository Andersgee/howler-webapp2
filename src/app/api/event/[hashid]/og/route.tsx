import { apiRscPublic } from "#src/trpc/api-rsc";
import { prettyDate } from "#src/utils/date";
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

    //this is more or less just satori: https://www.npmjs.com/package/satori
    //a tool that converts a subset of html and css to svg
    //but returns png instead
    //btw it only supports display flex or none, defaults to flex
    //here is allowed html elements and their default styles: https://github.com/vercel/satori/blob/main/src/handler/presets.ts
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontSize: 16,
            //fontSize: 40,
            //color: "black",
            background: "white",
            width: "100%",
            height: "100%",
            //padding: "50px 200px",
            //textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            //tw="flex flex-col space-y-6"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "16px",
              background: "#acacac",
            }}
          >
            <div
              //tw="flex items-center gap-2" //gap
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {/*<IconWhat />*/}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                //width={48}
                //height={48}
              >
                <path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path d="M6 6h.008v.008H6V6z" />
              </svg>
              <div tw="w-11 shrink-0">What</div>
              <div tw="">{`Lorem ipsum dolor sit amet consectetur adipisicing elit`}</div>
            </div>
            <div
              //tw="flex items-center gap-2" //gap
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {/*<IconWhere />*/}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <div tw="w-11 shrink-0">Where</div>
              <div tw="">{event.locationName ?? "anywhere"}</div>
            </div>
            <div
              //tw="flex items-center gap-2" //gap
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {/*<IconWhen />*/}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <div tw="w-11 shrink-0">When</div>
              <div>
                {/*<PrettyDate date={event.date} />*/}
                {`${prettyDate(event.date, false)} UTC`}
              </div>
            </div>
            <div
              //tw="flex items-center gap-2" //gap
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {/*<IconWho />*/}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <div tw="w-11 shrink-0">Who</div>
              <div>anyone</div>
            </div>
          </div>
        </div>
      ),
      {
        //width: 1200,
        //height: 630,
        width: 600,
        height: 315,
        //debug: true,
      }
    );
  } catch (err) {
    console.log(err);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
