"use client";

import { useStore } from "#src/store";
import { createPortal } from "react-dom";
import { LocateButton } from "../LocateButton";

export function ControlLocate() {
  const googleMaps = useStore.use.googleMaps();
  if (!googleMaps?.controls_element_locate) {
    return null;
  }
  return createPortal(
    <LocateButton onLocated={(p) => googleMaps.map.setOptions({ center: p, zoom: 15 })} />,
    googleMaps.controls_element_locate
  );
}
