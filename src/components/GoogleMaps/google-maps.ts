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

/**
 * simpler wrapper for interacting with google maps
 */
export class GoogleMapsClass {
  Map!: typeof google.maps.Map;
  AdvancedMarkerElement!: typeof google.maps.marker.AdvancedMarkerElement;
  PinElement!: typeof google.maps.marker.PinElement;
  InfoWindow!: typeof google.maps.InfoWindow;

  map: google.maps.Map | null;
  currentCenter: { lng: number; lat: number } | null;
  markerClusterer: MarkerClusterer | null;
  infoWindowElement: HTMLDivElement | null;

  eventMarker: google.maps.marker.AdvancedMarkerElement | null;
  chooseEventLocationMarker: google.maps.marker.AdvancedMarkerElement | null;
  constructor() {
    this.map = null;
    this.currentCenter = null;
    this.markerClusterer = null;
    this.eventMarker = null;
    this.chooseEventLocationMarker = null;
    this.infoWindowElement = null;
  }

  async loadLibs() {
    try {
      //load relevant libs
      //https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import
      const { Map, InfoWindow } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      this.Map = Map;
      this.InfoWindow = InfoWindow;
      this.AdvancedMarkerElement = AdvancedMarkerElement;
      this.PinElement = PinElement;

      return true;
    } catch (error) {
      return false;
    }
  }

  init(element: HTMLDivElement) {
    //tldr on cost:
    //the google cloud billing account gets 200 USD free usage each month for "Google Maps Platform APIs"
    //geocoding is 0.005 USD per request see https://developers.google.com/maps/documentation/geocoding/usage-and-billing#pricing-for-product
    //google maps is 0.007 USD per load, see https://developers.google.com/maps/documentation/javascript/usage-and-billing#pricing-for-product
    //
    //so essentially 28500 map loads per month is free

    this.map = new this.Map(element, {
      zoom: INITIAL_ZOOM,
      center: INITIAL_CENTER,
      mapId: TEST_MAP_ID,
      minZoom: 3,
    });

    //this.markerClusterer = new MarkerClusterer({ map: this.map });
    //this.markerClusterer = new MarkerClusterer({ map: this.map, algorithm: new GridAlgorithm({ gridSize: 50 }) });

    //this.infoWindowElement = document.createElement("div");
    //this.infoWindowElement.id = "google-maps-infowindow-element";

    //const infoWindow = new this.InfoWindow({
    //  content: "",
    //  disableAutoPan: true,
    //});
  }
}
