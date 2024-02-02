import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export function GET(request: NextRequest) {
  const lng = request.geo?.longitude;
  const lat = request.geo?.latitude;

  if (lng !== undefined && lat !== undefined) {
    const geo = { lng, lat };
    return new Response(JSON.stringify(geo), { status: 200 });
  }

  return new Response(JSON.stringify({ lat: 55.49, lng: 13.04 }), { status: 200 });
  //return new Response(null, { status: 204 });
}
