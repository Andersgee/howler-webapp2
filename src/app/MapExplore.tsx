"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { type RouterOutputs } from "#src/hooks/api";
import { useStore } from "#src/store";
import { useEffect } from "react";

type Props = {
  events: RouterOutputs["event"]["getAll"];
};

export function MapExplore({ events }: Props) {
  const googleMaps = useStore.use.googleMaps();

  useEffect(() => {
    if (!googleMaps) return;

    googleMaps.setMode("explore");
    googleMaps.addEventsAsMarkers(events);
    //googleMaps.map.setOptions({
    //  center: latLng,
    //  heading: 0,
    //  zoom: 11,
    //});
  }, [googleMaps, events]);

  return (
    <div className="h-96 w-full">
      <GoogleMaps />
    </div>
  );
}
