export const FULL_TEST_THEME: google.maps.MapTypeStyle[] = [
  //so these are pretty much borders (countries,municipalities) and city labels (only)
  f("administrative.country", "geometry.fill", "#ff0000"),
  f("administrative.country", "geometry.stroke", "#ff0000"),
  f("administrative.country", "labels.icon", "#ff0000"),
  f("administrative.country", "labels.text", "#ff0000"),
  f("administrative.country", "labels.text.fill", "#ff0000"),
  f("administrative.country", "labels.text.stroke", "#ff0000"),

  f("administrative.land_parcel", "geometry.fill", "#ff0000"),
  f("administrative.land_parcel", "geometry.stroke", "#ff0000"),
  f("administrative.land_parcel", "labels.icon", "#ff0000"),
  f("administrative.land_parcel", "labels.text", "#ff0000"),
  f("administrative.land_parcel", "labels.text.fill", "#ff0000"),
  f("administrative.land_parcel", "labels.text.stroke", "#ff0000"),

  f("administrative.locality", "geometry.fill", "#ff0000"),
  f("administrative.locality", "geometry.stroke", "#ff0000"),
  f("administrative.locality", "labels.icon", "#ff0000"),
  f("administrative.locality", "labels.text", "#ff0000"),
  f("administrative.locality", "labels.text.fill", "#ff0000"),
  f("administrative.locality", "labels.text.stroke", "#ff0000"),

  f("administrative.neighborhood", "geometry.fill", "#ff0000"),
  f("administrative.neighborhood", "geometry.stroke", "#ff0000"),
  f("administrative.neighborhood", "labels.icon", "#ff0000"),
  f("administrative.neighborhood", "labels.text", "#ff0000"),
  f("administrative.neighborhood", "labels.text.fill", "#ff0000"),
  f("administrative.neighborhood", "labels.text.stroke", "#ff0000"),

  f("administrative.province", "geometry.fill", "#ff0000"),
  f("administrative.province", "geometry.stroke", "#ff0000"),
  f("administrative.province", "labels.icon", "#ff0000"),
  f("administrative.province", "labels.text", "#ff0000"),
  f("administrative.province", "labels.text.fill", "#ff0000"),
  f("administrative.province", "labels.text.stroke", "#ff0000"),

  //what are these?
  //turns out landscape.man_made is buildings. but also "urban area" color
  //how to differentiate them?
  //{
  //  featureType: "landscape.man_made",
  //  elementType: "geometry.fill",
  //  stylers: [{ color: "#ffff00", visibility: "off" }],
  //},
  //f("landscape.man_made", "geometry.fill", "#ffff00"), //this is "urban area bg" AND "building bg"
  //f("landscape.man_made", "geometry.stroke", "#00ffff"), //this is "business building border".. or something. (not all buildings)
  f("landscape.man_made", "labels.icon", "#00ff00"),
  //f("landscape.man_made", "labels.text", "#00ff00"),
  //f("landscape.man_made", "labels.text.fill", "#0000ff"),
  //f("landscape.man_made", "labels.text.stroke", "#00ff00"),

  /*
  f("landscape.natural", "geometry.fill", "#00ff00"),
  f("landscape.natural", "geometry.stroke", "#00ff00"),
  f("landscape.natural", "labels.icon", "#00ff00"),
  f("landscape.natural", "labels.text", "#00ff00"),
  f("landscape.natural", "labels.text.fill", "#00ff00"),
  f("landscape.natural", "labels.text.stroke", "#00ff00"),

  f("landscape.natural.landcover", "geometry.fill", "#00ff00"),
  f("landscape.natural.landcover", "geometry.stroke", "#00ff00"),
  f("landscape.natural.landcover", "labels.icon", "#00ff00"),
  f("landscape.natural.landcover", "labels.text", "#00ff00"),
  f("landscape.natural.landcover", "labels.text.fill", "#00ff00"),
  f("landscape.natural.landcover", "labels.text.stroke", "#00ff00"),

  f("landscape.natural.terrain", "geometry.fill", "#00ff00"),
  f("landscape.natural.terrain", "geometry.stroke", "#00ff00"),
  f("landscape.natural.terrain", "labels.icon", "#00ff00"),
  f("landscape.natural.terrain", "labels.text", "#00ff00"),
  f("landscape.natural.terrain", "labels.text.fill", "#00ff00"),
  f("landscape.natural.terrain", "labels.text.stroke", "#00ff00"),
  */
];

const FEATURES: google.maps.MapTypeStyle[] = [
  //administrative
  { featureType: "administrative.country", elementType: "", stylers: [] },
  { featureType: "administrative.land_parcel", elementType: "", stylers: [] },
  { featureType: "administrative.locality", elementType: "", stylers: [] },
  { featureType: "administrative.neighborhood", elementType: "", stylers: [] },
  { featureType: "administrative.province", elementType: "", stylers: [] },
  //landscape
  { featureType: "landscape.man_made", elementType: "", stylers: [] },
  { featureType: "landscape.natural", elementType: "", stylers: [] },
  { featureType: "landscape.natural.landcover", elementType: "", stylers: [] },
  { featureType: "landscape.natural.terrain", elementType: "", stylers: [] },
  //poi
  { featureType: "poi.attraction", elementType: "", stylers: [] },
  { featureType: "poi.business", elementType: "", stylers: [] },
  { featureType: "poi.government", elementType: "", stylers: [] },
  { featureType: "poi.medical", elementType: "", stylers: [] },
  { featureType: "poi.park", elementType: "", stylers: [] },
  { featureType: "poi.place_of_worship", elementType: "", stylers: [] },
  { featureType: "poi.school", elementType: "", stylers: [] },
  { featureType: "poi.sports_complex", elementType: "", stylers: [] },
  //road
  { featureType: "road.arterial", elementType: "", stylers: [] },
  { featureType: "road.highway", elementType: "", stylers: [] },
  { featureType: "road.highway.controlled_access", elementType: "", stylers: [] },
  { featureType: "road.local", elementType: "", stylers: [] },
  //transit
  { featureType: "transit.line", elementType: "", stylers: [] },
  { featureType: "transit.station", elementType: "", stylers: [] },
  { featureType: "transit.station.airport", elementType: "", stylers: [] },
  { featureType: "transit.station.bus", elementType: "", stylers: [] },
  { featureType: "transit.station.rail", elementType: "", stylers: [] },
  //water
  { featureType: "water", elementType: "", stylers: [] },
];

type FeatureType =
  | "administrative.country"
  | "administrative.land_parcel"
  | "administrative.locality"
  | "administrative.neighborhood"
  | "administrative.province"
  | "landscape.man_made"
  | "landscape.natural"
  | "landscape.natural.landcover"
  | "landscape.natural.terrain"
  | "poi.attraction"
  | "poi.business"
  | "poi.government"
  | "poi.medical"
  | "poi.park"
  | "poi.place_of_worship"
  | "poi.school"
  | "poi.sports_complex"
  | "road.arterial"
  | "road.highway"
  | "road.highway.controlled_access"
  | "road.local"
  | "transit.line"
  | "transit.station"
  | "transit.station.airport"
  | "transit.station.bus"
  | "transit.station.rail"
  | "water";

/** a specific feature may support none, some, or all, of the elements */
type ElementType =
  | undefined
  | "geometry.fill"
  | "geometry.stroke"
  | "labels.icon"
  | "labels.text"
  | "labels.text.fill"
  | "labels.text.stroke";

function f(featureType: FeatureType, elementType: ElementType, color: string) {
  return { featureType, elementType, stylers: [{ color }] };
}

const ELEMENTS: google.maps.MapTypeStyle[] = [
  //administrative
  { featureType: "administrative.country", elementType: "geometry.fill", stylers: [] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [] },
  { featureType: "administrative.country", elementType: "labels.icon", stylers: [] },
  { featureType: "administrative.country", elementType: "labels.text", stylers: [] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [] },
  { featureType: "administrative.country", elementType: "labels.text.stroke", stylers: [] },

  { featureType: "administrative.land_parcel", elementType: "", stylers: [] },
  { featureType: "administrative.locality", elementType: "", stylers: [] },
  { featureType: "administrative.neighborhood", elementType: "", stylers: [] },
  { featureType: "administrative.province", elementType: "", stylers: [] },
  //landscape
  { featureType: "landscape.man_made", elementType: "", stylers: [] },
  { featureType: "landscape.natural", elementType: "", stylers: [] },
  { featureType: "landscape.natural.landcover", elementType: "", stylers: [] },
  { featureType: "landscape.natural.terrain", elementType: "", stylers: [] },
  //poi
  { featureType: "poi.attraction", elementType: "", stylers: [] },
  { featureType: "poi.business", elementType: "", stylers: [] },
  { featureType: "poi.government", elementType: "", stylers: [] },
  { featureType: "poi.medical", elementType: "", stylers: [] },
  { featureType: "poi.park", elementType: "", stylers: [] },
  { featureType: "poi.place_of_worship", elementType: "", stylers: [] },
  { featureType: "poi.school", elementType: "", stylers: [] },
  { featureType: "poi.sports_complex", elementType: "", stylers: [] },
  //road
  { featureType: "road.arterial", elementType: "", stylers: [] },
  { featureType: "road.highway", elementType: "", stylers: [] },
  { featureType: "road.highway.controlled_access", elementType: "", stylers: [] },
  { featureType: "road.local", elementType: "", stylers: [] },
  //transit
  { featureType: "transit.line", elementType: "", stylers: [] },
  { featureType: "transit.station", elementType: "", stylers: [] },
  { featureType: "transit.station.airport", elementType: "", stylers: [] },
  { featureType: "transit.station.bus", elementType: "", stylers: [] },
  { featureType: "transit.station.rail", elementType: "", stylers: [] },
  //water
  { featureType: "water", elementType: "", stylers: [] },
];
