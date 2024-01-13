import { GeoJSON } from "#src/db/geojson-types";
import { type RouterOutputs } from "#src/hooks/api";
import { setGoogleMapsPickedPoint } from "#src/store/actions";
import { absUrl } from "#src/utils/url";
import { GridAlgorithm, SuperClusterAlgorithm, MarkerClusterer } from "@googlemaps/markerclusterer";

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

  map!: google.maps.Map; //| null;
  primaryPin!: google.maps.marker.PinElement;
  primaryMarker!: google.maps.marker.AdvancedMarkerElement;
  exploreMarkers!: google.maps.marker.AdvancedMarkerElement[];
  markerClusterer!: MarkerClusterer;

  mode: "pick-location" | "view-event" | "explore";

  constructor() {
    console.log("GoogleMapsClass, constructor");
    //this.map = null;
    //this.markerClusterer = null;
    //this.primaryMarker = null
    this.mode = "view-event";
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
        maxZoom: 16,
        clickableIcons: false,
      });

      this.primaryPin = new PinElement({
        //scale: 1.5,
        scale: 1,
      });
      this.primaryMarker = new AdvancedMarkerElement({
        map: this.map,
        content: this.primaryPin.element,
        position: null,
        title: "This is where it happens.",
      });
      this.exploreMarkers = [];

      //https://github.com/mapbox/supercluster#readme
      this.markerClusterer = new MarkerClusterer({
        map: this.map,
        algorithm: new SuperClusterAlgorithm({ radius: 40, maxZoom: 16, minZoom: 3 }),
      });

      //const a= new SuperCl
      //this.markerClusterer.addMarkers()

      this.map.addListener("click", (e: EventClick) => {
        console.log("click, e:", e);
        const latLng = e.latLng;
        if (this.mode === "pick-location") {
          this.primaryMarker.position = latLng;
          setGoogleMapsPickedPoint({ type: "Point", coordinates: [latLng.lat(), latLng.lng()] });
        }
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  addEventsAsMarkers(events: RouterOutputs["event"]["getAll"]) {
    const markers = events.map((event) => {
      const pinGlyph = new google.maps.marker.PinElement({
        glyph: event.title,
        glyphColor: "white",
      });
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: event.location!.coordinates[0], lng: event.location!.coordinates[1] },
        content: pinGlyph.element,
      });

      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      //marker.addListener("click", () => {
      //  infoWindow.setContent(position.lat + ", " + position.lng);
      //  infoWindow.open(map, marker);
      //});
      return marker;
    });

    this.markerClusterer.addMarkers(markers);
  }
}

//any way to
type EventClick = { latLng: google.maps.LatLng };
