"use client";

import { useStore } from "#src/store";
import { createPortal } from "react-dom";
import { Button } from "#src/ui/button";
import { setGoogleMapsPickedPoint } from "#src/store/slices/map";
import { IconLocateOff } from "#src/icons/LocateOff";

export function ControlUnpickPoint() {
  const googleMaps = useStore.use.googleMaps();
  if (!googleMaps?.controls_element_unpick_point) {
    return null;
  }
  return createPortal(<Content />, googleMaps.controls_element_unpick_point);
}

function Content() {
  const point = useStore.use.googleMapsPickedPoint();

  if (!point) {
    return null;
  }

  return (
    <Button variant="icon" aria-label="unpick-point" onClick={() => setGoogleMapsPickedPoint(null)}>
      <IconLocateOff />
    </Button>
  );
}
