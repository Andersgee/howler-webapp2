import type { StateCreator } from "zustand";
import { type GoogleMapsClass } from "#src/components/GoogleMaps/google-maps-class";
import { type GeoJson } from "#src/db/types-geojson";
import { useStore } from "..";
import { exitFullscreen, requestFullscreen } from "#src/utils/fullscreen";

export type MapSlice = {
  //whereSearchValue: string;
  googleMaps: GoogleMapsClass | null;
  googleMapsElement: HTMLDivElement | null;
  googleMapsPickedPoint: GeoJson["Point"] | null;
  googleMapsExploreSelectedEventId: bigint | null;
  googleMapIsFullscreen: boolean;
};

export const createMapSlice: StateCreator<MapSlice, [], [], MapSlice> = (_set, _get) => ({
  //whereSearchValue: "",
  googleMaps: null,
  googleMapsElement: null,
  googleMapsPickedPoint: null,
  googleMapsExploreSelectedEventId: null,
  googleMapIsFullscreen: false,
});

//export function setWhereSearchValue(str: string) {
//  useStore.setState({ whereSearchValue: str });
//}

export function setGoogleMapsElement(el: HTMLDivElement) {
  useStore.setState({ googleMapsElement: el });
}

export function setGoogleMapsPickedPoint(point: GeoJson["Point"] | null) {
  useStore.setState({ googleMapsPickedPoint: point });
}

export function setGoogleMapsExploreSelectedEventId(id: bigint | null) {
  useStore.setState({ googleMapsExploreSelectedEventId: id });
}

export function setGoogleMapIsFullscreen(bool: boolean) {
  useStore.setState({ googleMapIsFullscreen: bool });
}

export function requestGoogleMapsFullscreen() {
  const element = useStore.getState().googleMapsElement;
  if (element) {
    requestFullscreen(element);
  }
}

export function closeGoogleMapsFullscreen() {
  exitFullscreen();
  //useStore.setState({ googleMapIsFullscreen: false });
}
