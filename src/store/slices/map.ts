import type { StateCreator } from "zustand";
import { type GoogleMapsClass } from "#src/components/GoogleMaps/google-maps-class";

export type MapSlice = {
  /** when this exists, everything is ready to go. */
  googleMaps: GoogleMapsClass | null;
  googleMapsElement: HTMLDivElement | null;
};

export const createMapSlice: StateCreator<MapSlice, [], [], MapSlice> = (set, get) => ({
  googleMaps: null,
  googleMapsElement: null,
});
