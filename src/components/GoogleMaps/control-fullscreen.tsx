"use client";

import { IconMaximize } from "#src/icons/maximize";
import { IconMinimize } from "#src/icons/minimize";
import { useStore } from "#src/store";
import { closeGoogleMapsFullscreen, requestGoogleMapsFullscreen } from "#src/store/slices/map";
import { Button } from "#src/ui/button";
import { createPortal } from "react-dom";

export function ControlFullscreen() {
  const googleMaps = useStore.use.googleMaps();

  if (!googleMaps?.controls_element_fullscreen) {
    return null;
  }
  return createPortal(<Content />, googleMaps.controls_element_fullscreen);
}

function Content() {
  const element = useStore.use.googleMapsElement();
  const googleMapIsFullscreen = useStore.use.googleMapIsFullscreen();

  if (!element) return null;

  return (
    <Button
      variant="icon"
      aria-label="fullscreen"
      onClick={() => {
        if (googleMapIsFullscreen) {
          closeGoogleMapsFullscreen();
        } else {
          requestGoogleMapsFullscreen();
        }
      }}
    >
      {googleMapIsFullscreen ? <IconMinimize /> : <IconMaximize />}
    </Button>
  );
}
