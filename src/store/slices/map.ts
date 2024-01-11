import type { Component } from "react";
import type { StateCreator } from "zustand";
import { GoogleMapsClass } from "#src/components/GoogleMaps/google-maps";
import { type HtmlPortalNode } from "#src/components/GoogleMaps/reverse-portal";

export type MapSlice = {
  /** when this exists, everything is ready to go. */
  googleMaps: GoogleMapsClass | null;
  googleMapsLibsAreLoaded: GoogleMapsClass | null;
  loadGoogleMapsLibs: () => Promise<void>;
  initGoogleMaps: (element: HTMLDivElement) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapPortalNode: HtmlPortalNode<Component<any>> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapSetPortalNode: (node: HtmlPortalNode<Component<any>>) => void;
};

export const createMapSlice: StateCreator<MapSlice, [], [], MapSlice> = (set, get) => ({
  googleMaps: null,
  googleMapsLibsAreLoaded: null,
  loadGoogleMapsLibs: async () => {
    if (get().googleMaps !== null) return;
    const googleMapsInstance = new GoogleMapsClass();
    const ok = await googleMapsInstance.loadLibs();
    if (ok) {
      set({ googleMapsLibsAreLoaded: googleMapsInstance });
    }
  },
  initGoogleMaps: (element) => {
    const { googleMaps, googleMapsLibsAreLoaded } = get();
    if (googleMaps !== null || googleMapsLibsAreLoaded === null) return;

    googleMapsLibsAreLoaded.init(element);
    set({ googleMaps: googleMapsLibsAreLoaded });
  },
  mapPortalNode: null,
  mapSetPortalNode: (node) => set({ mapPortalNode: node }),
});
