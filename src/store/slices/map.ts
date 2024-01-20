import type { StateCreator } from "zustand";
import { GoogleMapsClass } from "#src/components/GoogleMaps/google-maps-class";
import { type GeoJSON } from "#src/db/geojson-types";
import { useStore } from "..";

export type MapSlice = {
  googleMaps: GoogleMapsClass | null;
  googleMapsElement: HTMLDivElement | null;
  googleMapsPickedPoint: GeoJSON["Point"] | null;
  googleMapsExploreSelectedEventId: bigint | null;
};

export const createMapSlice: StateCreator<MapSlice, [], [], MapSlice> = (_set, _get) => ({
  googleMaps: null,
  googleMapsElement: null,
  googleMapsPickedPoint: null,
  googleMapsExploreSelectedEventId: null,
});

export function setGoogleMapsElement(el: HTMLDivElement) {
  useStore.setState({ googleMapsElement: el });
}

export function setGoogleMapsPickedPoint(point: GeoJSON["Point"]) {
  useStore.setState({ googleMapsPickedPoint: point });
}

export function setGoogleMapsExploreSelectedEventId(id: bigint | null) {
  useStore.setState({ googleMapsExploreSelectedEventId: id });
}

export async function initGoogleMaps(el: HTMLDivElement) {
  const googleMaps = new GoogleMapsClass();
  const ok = await googleMaps.init(el);
  if (ok) {
    useStore.setState({ googleMaps });
  } else {
    console.log("could not init googleMaps");
  }
}
