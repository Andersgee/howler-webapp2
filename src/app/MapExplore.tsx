"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { type RouterOutputs } from "#src/hooks/api";
import { useStore } from "#src/store";
import { useEffect } from "react";
import { InfoWindow } from "./ExploreInfoWindow";

type Props = {
  initialEvents: RouterOutputs["event"]["getAll"];
};

export function MapExplore({ initialEvents }: Props) {
  const googleMaps = useStore.use.googleMaps();

  useEffect(() => {
    if (!googleMaps) return;

    googleMaps.setMode("explore");
    googleMaps.addEventsAsMarkers(initialEvents);
    //googleMaps.map.setOptions({
    //  center: latLng,
    //  heading: 0,
    //  zoom: 11,
    //});
  }, [googleMaps, initialEvents]);

  return (
    <div>
      <div className="h-96 w-full">
        <GoogleMaps />
      </div>
      <InfoWindow />
    </div>
  );
}