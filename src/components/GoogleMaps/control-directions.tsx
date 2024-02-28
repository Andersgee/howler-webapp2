"use client";

import { useStore } from "#src/store";
import { createPortal } from "react-dom";
import { latLngLiteralFromPoint } from "./google-maps-point-latlng";
import { type GeoJson } from "#src/db/types-geojson";
import { cn } from "#src/utils/cn";
import { IconCar } from "#src/icons/Car";

export function ControlDirections({ location }: { location: GeoJson["Point"] }) {
  const googleMaps = useStore.use.googleMaps();
  if (!googleMaps?.controls_element_directions) {
    return null;
  }
  return createPortal(
    <a
      target="_blank"
      href={googleMapsDirectionsUrl(location)}
      className={cn(
        "flex h-11 items-center justify-center rounded-md text-sm font-bold outline-none transition-colors focus-visible:focusring disabled:pointer-events-none disabled:opacity-50",
        "bg-color-neutral-100 p-[10px] text-color-neutral-900 hover:bg-color-neutral-200 hover:text-color-neutral-1000", //icon
        "m-2"
      )}
    >
      <IconCar className="mr-1" />
      Directions
    </a>,
    googleMaps.controls_element_directions
  );
}

//https://developers.google.com/maps/documentation/urls/get-started#directions-action
function googleMapsDirectionsUrl(location: GeoJson["Point"]) {
  const l = latLngLiteralFromPoint(location);
  const u = new URL("https://www.google.com/maps/dir/?api=1");
  u.searchParams.set("destination", `${l.lat},${l.lng}`);
  return u.href;
}
