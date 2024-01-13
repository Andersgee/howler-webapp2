"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { type GeoJSON } from "#src/db/geojson-types";
import { useStore } from "#src/store";
import { Button } from "#src/ui/button";
import { useEffect, useState } from "react";

type Props = {
  location: GeoJSON["Point"];
  locationName: string | null;
};

export function MapButton({ location, locationName }: Props) {
  const googleMaps = useStore.use.googleMaps();
  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    if (!googleMaps) return;

    const latLng = { lat: location.coordinates[0], lng: location.coordinates[1] };
    googleMaps.mode = "view-event";
    googleMaps.primaryMarker.position = latLng;
    googleMaps.map.setOptions({
      center: latLng,
      heading: 0,
      zoom: 11,
    });
  }, [googleMaps, location, showMap]);

  return (
    <>
      <Button variant="outline" onClick={() => setShowMap((prev) => !prev)}>
        {showMap ? "close map" : "show map"}
      </Button>
      {showMap && (
        <div className="h-96 w-full">
          <GoogleMaps />
        </div>
      )}
    </>
  );
}
