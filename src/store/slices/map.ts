import type { StateCreator } from "zustand";
import { type GoogleMapsClass } from "#src/components/GoogleMaps/google-maps-class";
import { type GeoJSON } from "#src/db/geojson-types";

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
