"use client";

import { api } from "#src/hooks/api";
import { useStore } from "#src/store";
import { JSONE } from "#src/utils/jsone";
//import { useEffect, useState } from "react";
//import { createPortal } from "react-dom";

/*
export function InfoWindow() {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const googleMaps = useStore.use.googleMaps();

  useEffect(() => {
    if (!googleMaps?.infoWindowElement) return;
    setNode(googleMaps.infoWindowElement);
  }, [googleMaps?.infoWindowElement]);

  if (!node) {
    return null;
  }

  return createPortal(<InfowindowContent />, node);
}
*/
export function InfowindowContent() {
  const googleMapsExploreSelectedEventId = useStore.use.googleMapsExploreSelectedEventId();
  //const mapSetClickedEventId = useStore.use.mapSetClickedEventId();

  const query = api.event.getById.useQuery(
    { id: googleMapsExploreSelectedEventId! },
    {
      enabled: !!googleMapsExploreSelectedEventId,
    }
  );
  //const query = api.event.getById.useQuery({ id: BigInt(2) });

  if (!query.data) return <div>no data</div>;

  return <div>{JSONE.stringify(query.data, 2)}</div>;
}
