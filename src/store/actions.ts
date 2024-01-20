import { GoogleMapsClass } from "#src/components/GoogleMaps/google-maps-class";
import { useStore } from ".";

export async function initGoogleMaps(el: HTMLDivElement) {
  const googleMaps = new GoogleMapsClass();
  const ok = await googleMaps.init(el);
  if (ok) {
    useStore.setState({ googleMaps });
  } else {
    console.log("could not init googleMaps");
  }
}
