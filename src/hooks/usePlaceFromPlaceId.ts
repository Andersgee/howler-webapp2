import { useStore } from "#src/store";
import { useEffect } from "react";
import { api } from "./api";

/** the google places api dont give actual location, so use this to get "more info" from a placeId */
export function usePlaceFromPlaceId(placeId: string | null) {
  const googleMaps = useStore.use.googleMaps();
  const { data: place } = api.geocode.fromPlaceId.useQuery({ placeId: placeId! }, { enabled: !!placeId });

  //pan google maps to the point also if its open
  useEffect(() => {
    if (place && googleMaps) {
      googleMaps.map.panTo(place.geometry.location);
      googleMaps.setPickedPointAndMarker(place.geometry.location);
    }
  }, [place, googleMaps]);

  return place;
}
