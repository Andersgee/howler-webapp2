//"use client";

import { useStore } from "#src/store";
import { createPortal } from "react-dom";
import { LocateButton } from "../LocateButton";

type Props = {
  onLocated: (p: { lng: number; lat: number }) => void;
};
export function ControlLocate({ onLocated }: Props) {
  const googleMaps = useStore.use.googleMaps();
  if (!googleMaps?.controls_element_locate) {
    return null;
  }

  //(p) => googleMaps.map.setOptions({ center: p, zoom: 15 })},
  return createPortal(<LocateButton onLocated={onLocated} />, googleMaps.controls_element_locate);
}
