"use client";

import { IconMaximize } from "#src/icons/maximize";
//import { IconMinimize } from "#src/icons/minimize";
import { useStore } from "#src/store";
import { Button } from "#src/ui/button";
import { exitFullscreen, requestFullscreen, isFullscreen } from "#src/utils/fullscreen";
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

  if (!element) return null;

  return (
    <Button
      variant="icon"
      aria-label="fullscreen"
      onClick={() => {
        if (isFullscreen(element)) {
          exitFullscreen();
        } else {
          requestFullscreen(element);
        }
      }}
    >
      <IconMaximize />
    </Button>
  );
}
