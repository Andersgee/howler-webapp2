"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { api, type RouterOutputs } from "#src/hooks/api";
import { useStore } from "#src/store";
import { useEffect } from "react";
import { InfowindowContent } from "./ExploreInfoWindow";
import { JSONE } from "#src/utils/jsone";
//import { InfoWindow } from "./ExploreInfoWindow";

type Props = {
  events: RouterOutputs["event"]["getAll"];
};

export function MapExplore({ events }: Props) {
  const googleMaps = useStore.use.googleMaps();
  const googleMapsExploreSelectedEventId = useStore.use.googleMapsExploreSelectedEventId();
  const query = api.event.getById.useQuery({ id: BigInt("2") });

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
    <div>
      <div>googleMapsExploreSelectedEventId: {googleMapsExploreSelectedEventId?.toString()}</div>
      <div>query data: {JSONE.stringify(query.data ?? "no data")}</div>
      <div className="h-96 w-full">
        <GoogleMaps />
      </div>
      <InfowindowContent />
      {/*<InfoWindow />*/}
    </div>
  );
}
