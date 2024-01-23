"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { ShareButton } from "#src/components/ShareButton";
import { type GeoJson } from "#src/db/types-geojson";
import { type RouterOutputs } from "#src/hooks/api";
import { IconEdit } from "#src/icons/Edit";
import { IconWhere } from "#src/icons/Where";
import { useStore } from "#src/store";
import { Button, buttonVariants } from "#src/ui/button";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  isCreator: boolean;
  event: RouterOutputs["event"]["getById"];
};

export function EventActions({ isCreator, event }: Props) {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <div className="mb-2 mt-4 flex gap-2">
        {event.location && (
          <Button variant="icon" onClick={() => setShowMap((prev) => !prev)}>
            <IconWhere /> {showMap ? "close map" : "show map"}
          </Button>
        )}
        {isCreator && (
          <Link href={`/event/${hashidFromId(event.id)}/edit`} className={buttonVariants({ variant: "icon" })}>
            <IconEdit /> Edit
          </Link>
        )}
        <ShareButton title={event.title} />
      </div>
      <Map show={showMap} location={event.location} />
    </>
  );
}

function Map({ show, location }: { show: boolean; location: null | GeoJson["Point"] }) {
  const googleMaps = useStore.use.googleMaps();
  useEffect(() => {
    if (!googleMaps || !location) return;

    const latLng = { lat: location.coordinates[0], lng: location.coordinates[1] };
    googleMaps.setMode("view-event");
    googleMaps.primaryMarker.position = latLng;
    googleMaps.map.setOptions({
      center: latLng,
      heading: 0,
      zoom: 11,
    });
  }, [googleMaps, location]);

  return show ? (
    <div className="h-96 w-full">
      <GoogleMaps />
    </div>
  ) : null;
}
