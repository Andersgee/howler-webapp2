import { type RouterOutputs } from "#src/hooks/api";
import { setGoogleMapsExploreSelectedEventId, setGoogleMapsPickedPoint } from "#src/store/actions";
import { absUrl } from "#src/utils/url";
import { SuperClusterAlgorithm, MarkerClusterer } from "@googlemaps/markerclusterer";

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
  controls_element_infowindow!: HTMLDivElement;
  infoWindow!: google.maps.InfoWindow;
  controls_element_search!: HTMLDivElement;
  controls_element_locate!: HTMLDivElement;

  mode: "pick-location" | "view-event" | "explore";

  constructor() {
    console.log("GoogleMapsClass, constructor");
    //this.map = null;
    //this.markerClusterer = null;
    //this.primaryMarker = null
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

  async init(element: HTMLDivElement) {
    console.log("GoogleMapsClass, init");
    try {
      //load relevant libs
      //https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import
      const { Map, InfoWindow } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;
      const { Size, ControlPosition } = (await google.maps.importLibrary("core")) as google.maps.CoreLibrary;

      ControlPosition.TOP_CENTER;
      //const {ControlPosition} = await google.maps.importLibrary("core")

      //this.Map = Map;
      //this.InfoWindow = InfoWindow;
      //this.AdvancedMarkerElement = AdvancedMarkerElement;
      //this.PinElement = PinElement;

      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const isDarkMode = media.matches;
      media.addEventListener("change", (ev) => {
        if (ev.matches) {
          console.log("is now dark mode");
        } else {
          console.log("is now light mode");
        }
      });

      this.map = new google.maps.Map(element, {
        zoom: INITIAL_ZOOM,
        center: INITIAL_CENTER,
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
        mapTypeControl: false,
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
      });

      this.primaryPin = new PinElement({
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
      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM]!.push(this.controls_element_locate);

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
        console.log("click, e:", e);
        const latLng = e.latLng;
        if (this.mode === "pick-location") {
          this.primaryMarker.position = latLng;
          setGoogleMapsPickedPoint({ type: "Point", coordinates: [latLng.lat(), latLng.lng()] });
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

  addEventsAsMarkers(events: RouterOutputs["event"]["getAll"]) {
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

      const latLng = { lat: event.location!.coordinates[0], lng: event.location!.coordinates[1] };
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

////https://developers.google.com/maps/documentation/javascript/examples/style-array#maps_style_array-typescript
const STYLES_DARK: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];
