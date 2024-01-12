import { GoogleMapsClass } from "#src/components/GoogleMaps/google-maps-class";
import { useStore } from "./index";

export const setGoogleMapsElement = (el: HTMLDivElement) => {
  useStore.setState({ googleMapsElement: el });
};

export const initGoogleMaps = async (el: HTMLDivElement) => {
  const googleMaps = new GoogleMapsClass();
  const ok = await googleMaps.init(el);
  if (ok) {
    useStore.setState({ googleMaps });
  } else {
    console.log("could not init googleMaps");
  }
};
