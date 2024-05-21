import { useEffect, useRef, useState } from "react";
import { z } from "zod";

/**
 * if hosting on vercel, we have request.geo populated in edge route handlers
 *
 * so grab it from there, return undefined until its fetched, after that, return either the lng,lat or null
 */
export function useGeo() {
  const [geo, setGeo] = useState<{ lng: number; lat: number } | null | undefined>(undefined);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; //only run once even in development
    didRun.current = true;
    getGeo()
      .then((x) => setGeo(x))
      .catch(() => setGeo(null));
  }, []);
  return geo;
}

async function getGeo() {
  try {
    const res = await fetch("/api/geo");
    if (res.status === 200) {
      const geo = z
        .object({ lng: z.coerce.number(), lat: z.coerce.number() })
        .parse(await JSON.parse(await res.text()));
      return geo;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
