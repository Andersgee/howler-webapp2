import { GridAlgorithm, type MarkerClusterer } from "@googlemaps/markerclusterer";

//https://console.cloud.google.com/google/maps-apis/studio/maps
const TEST_MAP_ID = "478ad7a3d9f73ca4";

//https://developers.google.com/maps/documentation/javascript/events

/*
also geocoding:
https://developers.google.com/maps/documentation/geocoding/overview

also samples:
https://github.com/googlemaps/js-samples/tree/main/samples

clustering markers:
https://developers.google.com/maps/documentation/javascript/marker-clustering

tiling, how google handles map and tile coordinates:
https://developers.google.com/maps/documentation/javascript/coordinates
*/

const INITIAL_ZOOM = 5;
const INITIAL_CENTER = { lat: 55.49, lng: 13.04 };

export class GoogleMapsClass {
  //Map!: typeof google.maps.Map;
  //AdvancedMarkerElement!: typeof google.maps.marker.AdvancedMarkerElement;
  //PinElement!: typeof google.maps.marker.PinElement;
  //InfoWindow!: typeof google.maps.InfoWindow;

  map: google.maps.Map | null;
  markerClusterer: MarkerClusterer | null;

  constructor() {
    console.log("GoogleMapsClass, constructor");
    this.map = null;
    this.markerClusterer = null;
  }

  async init(element: HTMLDivElement) {
    console.log("GoogleMapsClass, init");
    try {
      //load relevant libs
      //https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import
      const { Map, InfoWindow } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      //this.Map = Map;
      //this.InfoWindow = InfoWindow;
      //this.AdvancedMarkerElement = AdvancedMarkerElement;
      //this.PinElement = PinElement;

      this.map = new Map(element, {
        zoom: INITIAL_ZOOM,
        center: INITIAL_CENTER,
        mapId: TEST_MAP_ID,
        minZoom: 3,
      });

      const a: google.maps.marker.AdvancedMarkerElement | null = null;

      this.map.addListener("click", (clickEvent: unknown) => {
        console.log("clickEvent:", clickEvent);
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
