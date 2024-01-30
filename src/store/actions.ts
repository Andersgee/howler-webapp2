import { GoogleMapsClass } from "#src/components/GoogleMaps/google-maps-class";
import { useStore } from ".";

export async function initGoogleMaps(el: HTMLDivElement, initialCenter: { lat: number; lng: number } | null) {
  const googleMaps = new GoogleMapsClass();
  const ok = await googleMaps.init(el, initialCenter);
  if (ok) {
    useStore.setState({ googleMaps });
  } else {
    console.log("could not init googleMaps");
  }
}
