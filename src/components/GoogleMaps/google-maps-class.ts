import { type RouterOutputs } from "#src/hooks/api";
import { setGoogleMapsExploreSelectedEventId, setGoogleMapsPickedPoint } from "#src/store/slices/map";
import { absUrl } from "#src/utils/url";
import { SuperClusterAlgorithm, MarkerClusterer } from "@googlemaps/markerclusterer";
import { HOWLER_MAP_DARK, HOWLER_MAP_LIGHT } from "./custom-theme";
import { latLngLiteralFromPoint, pointFromlatLngLiteral } from "./google-maps-point-latlng";

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

const MIN_ZOOM = 3;
const MAX_ZOOM = 18;
const INITIAL_ZOOM = 5;
//const INITIAL_CENTER = { lat: 55.49, lng: 13.04 };
//const INITIAL_ZOOM = 17;
//const INITIAL_CENTER = { lat: 59.9124033, lng: 16.3235665 };

export class GoogleMapsClass {
  map!: google.maps.Map;
  primaryPin!: google.maps.marker.PinElement;
  primaryMarker!: google.maps.marker.AdvancedMarkerElement;
  exploreMarkers!: google.maps.marker.AdvancedMarkerElement[];
  markerClusterer!: MarkerClusterer;
  controls_element_infowindow!: HTMLDivElement;
  infoWindow!: google.maps.InfoWindow;
  controls_element_search!: HTMLDivElement;
  controls_element_locate!: HTMLDivElement;
  controls_element_unpick_point!: HTMLDivElement;
  controls_element_footer!: HTMLDivElement;
  controls_element_directions!: HTMLDivElement;

  mode: "pick-location" | "view-event" | "explore";

  constructor() {
    this.mode = "view-event";
  }

  /** clean up markers and state */
  setMode(mode: "pick-location" | "view-event" | "explore") {
    this.markerClusterer.clearMarkers();
    this.primaryMarker.position = null;
    this.infoWindow.setPosition(null);
    this.infoWindow.close();

    this.mode = mode;
  }

  async init(element: HTMLDivElement, initialCenter: { lat: number; lng: number } | null) {
    try {
      //load relevant libs
      //https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import
      //const { Map, InfoWindow } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      //const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
      //const { Size, ControlPosition } = (await google.maps.importLibrary("core")) as google.maps.CoreLibrary;
      await Promise.all([
        google.maps.importLibrary("maps"),
        google.maps.importLibrary("marker"),
        google.maps.importLibrary("core"),
      ]);

      //const {ControlPosition} = await google.maps.importLibrary("core")

      //this.Map = Map;
      //this.InfoWindow = InfoWindow;
      //this.AdvancedMarkerElement = AdvancedMarkerElement;
      //this.PinElement = PinElement;

      this.map = new google.maps.Map(element, {
        zoom: INITIAL_ZOOM,
        center: initialCenter ?? { lat: 55.49, lng: 13.04 },
        mapId: TEST_MAP_ID,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        clickableIcons: false,
        //https://developers.google.com/maps/documentation/javascript/controls#ControlModification
        fullscreenControl: false,
        zoomControl: false,
        streetViewControl: false,
        rotateControl: false,
        scaleControl: false,
        //mapTypeControl: false,
        //mapTypeControlOptions: {
        //  position: google.maps.ControlPosition.BOTTOM_CENTER,
        //  style: google.maps.MapTypeControlStyle.DEFAULT,
        //  //https://developers.google.com/maps/documentation/javascript/maptypes#BasicMapTypes
        //  //mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"],
        //  mapTypeIds: ["roadmap", "satellite"],
        //},
        //styling
        //https://developers.google.com/maps/documentation/javascript/style-reference#stylers
        //styles: STYLES_DARK,

        mapTypeControl: false,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER,
          //mapTypeIds: ["roadmap", "andy_lm", "andy_dm"],
          mapTypeIds: ["andy_lm", "andy_dm"],
        },
      });

      const andy_lm = new google.maps.StyledMapType(HOWLER_MAP_LIGHT, { name: "light mode" });
      this.map.mapTypes.set("andy_lm", andy_lm);

      const andy_dm = new google.maps.StyledMapType(HOWLER_MAP_DARK, { name: "dark mode" });
      this.map.mapTypes.set("andy_dm", andy_dm);

      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const isDarkMode = media.matches;
      if (isDarkMode) {
        this.map.setMapTypeId("andy_dm");
      } else {
        this.map.setMapTypeId("andy_lm");
      }
      media.addEventListener("change", (ev) => {
        if (ev.matches) {
          this.map.setMapTypeId("andy_dm");
        } else {
          this.map.setMapTypeId("andy_lm");
        }
      });

      this.primaryPin = new google.maps.marker.PinElement({
        //scale: 1.5,
        scale: 1,
      });
      this.primaryMarker = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        content: this.primaryPin.element,
        position: null,
        title: "This is where it happens.",
      });
      this.exploreMarkers = [];
      this.controls_element_infowindow = document.createElement("div");
      this.infoWindow = new google.maps.InfoWindow({
        content: this.controls_element_infowindow,
        disableAutoPan: true,
        //position: null,
        pixelOffset: new google.maps.Size(0, -36), //offset relative to position
      });

      //https://developers.google.com/maps/documentation/javascript/controls#ControlPositioning
      this.controls_element_search = document.createElement("div");
      this.map.controls[google.maps.ControlPosition.TOP_LEFT]!.push(this.controls_element_search);

      this.controls_element_locate = document.createElement("div");
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT]!.push(this.controls_element_locate);

      this.controls_element_unpick_point = document.createElement("div");
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT]!.push(this.controls_element_unpick_point);

      this.controls_element_footer = document.createElement("div");
      this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT]!.push(this.controls_element_footer);

      this.controls_element_footer = document.createElement("div");
      this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT]!.push(this.controls_element_footer);

      this.controls_element_directions = document.createElement("div");
      this.map.controls[google.maps.ControlPosition.TOP_LEFT]!.push(this.controls_element_directions);

      //https://github.com/mapbox/supercluster#readme
      this.markerClusterer = new MarkerClusterer({
        map: this.map,
        algorithm: new SuperClusterAlgorithm({ radius: 40, minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM }),
      });

      this.infoWindow.addListener("closeclick", () => {
        setGoogleMapsExploreSelectedEventId(null);
      });

      this.map.addListener("click", (e: EventClick) => {
        //click on map (not infowindow)
        const latLng = e.latLng;
        if (this.mode === "pick-location") {
          this.setPickedPointAndMarker({ lat: latLng.lat(), lng: latLng.lng() });
          //this.primaryMarker.position = latLng;
          //setGoogleMapsPickedPoint(pointFromlatLng(latLng));
        }
        if (this.mode === "explore") {
          setGoogleMapsExploreSelectedEventId(null);
          this.infoWindow.close();
        }
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  setPickedPointAndMarker(latLng: google.maps.LatLngLiteral | null) {
    this.primaryMarker.position = latLng;
    setGoogleMapsPickedPoint(latLng ? pointFromlatLngLiteral(latLng) : null);
  }

  addEventsAsMarkers(events: RouterOutputs["event"]["explore"]["events"]) {
    const markers = events.map((event) => {
      const glyphImg = document.createElement("img");
      glyphImg.src = absUrl("/icons/pin.svg");
      const pinGlyph = new google.maps.marker.PinElement({
        glyph: glyphImg,
        glyphColor: "#fff",
        background: "#fff",
        borderColor: "#fff",
        scale: 1.5, //default looks like 24px, recommended is atleast 44px, lets do 36? adjust pin.svg accordingly
      });

      const latLng = latLngLiteralFromPoint(event.location);
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: latLng,
        content: pinGlyph.element,
      });

      marker.addListener("click", () => {
        setGoogleMapsExploreSelectedEventId(event.id);
        this.infoWindow.setPosition(latLng);
        this.infoWindow.open({ map: this.map, shouldFocus: true });
        //this.infoWindow.open({
        //  map: this.map,
        //  //anchor: marker,
        //  //shouldFocus: true,
        //});
      });

      return marker;
    });

    this.markerClusterer.addMarkers(markers);
  }
}

//any way to
type EventClick = { latLng: google.maps.LatLng };
