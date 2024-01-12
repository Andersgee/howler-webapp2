import { GoogleMapsClass } from "#src/components/GoogleMaps/google-maps-class";
import { useStore } from "./index";

export const setGoogleMapsElement = (el: HTMLDivElement) => {
  useStore.setState({ googleMapsElement: el });
};

export const initGoogleMaps = async (el: HTMLDivElement) => {
  const googleMaps = new GoogleMapsClass();
  await googleMaps.init(el);

  useStore.setState({ googleMaps });
};
