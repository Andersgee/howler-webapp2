export const FULL_TEST_THEME: google.maps.MapTypeStyle[] = [
  //so these are pretty much borders (countries,municipalities) and city labels (only)
  //I think prob many of them are not needed
  /*
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
  */

  /*
  //set these on map base style instead (can not set "building color" and "urban area color" separately from javascript)
  //I disabled urban area and put buildings as pure black. should work for both light/dark mode...
  //f("landscape.man_made", "geometry.fill", ""), //this is "urban area bg" AND "building bg"
  //f("landscape.man_made", "geometry.stroke", """), //this is "business building border"..
  //f("landscape.man_made", "labels.icon", ""),
  //f("landscape.man_made", "labels.text", ""),
  //f("landscape.man_made", "labels.text.fill", ""),
  //f("landscape.man_made", "labels.text.stroke", ""),
  //this is general ground color..
  f("landscape.natural", "geometry.fill", "#00ff00"),
  f("landscape.natural", "geometry.stroke", "#00ff00"),
  f("landscape.natural", "labels.icon", "#00ff00"),
  f("landscape.natural", "labels.text", "#00ff00"),
  f("landscape.natural", "labels.text.fill", "#00ff00"),
  f("landscape.natural", "labels.text.stroke", "#00ff00"),
  //this is also general ground color.. when zoomed out a bit
  f("landscape.natural.landcover", "geometry.fill", "#00ff00"),
  f("landscape.natural.landcover", "geometry.stroke", "#00ff00"),
  f("landscape.natural.landcover", "labels.icon", "#00ff00"),
  f("landscape.natural.landcover", "labels.text", "#00ff00"),
  f("landscape.natural.landcover", "labels.text.fill", "#00ff00"),
  f("landscape.natural.landcover", "labels.text.stroke", "#00ff00"),
  //this seems to be "hills" or something, cant relly find any..
  f("landscape.natural.terrain", "geometry.fill", "#00ff00"),
  f("landscape.natural.terrain", "geometry.stroke", "#00ff00"),
  f("landscape.natural.terrain", "labels.icon", "#00ff00"),
  f("landscape.natural.terrain", "labels.text", "#00ff00"),
  f("landscape.natural.terrain", "labels.text.fill", "#00ff00"),
  f("landscape.natural.terrain", "labels.text.stroke", "#00ff00"),
  */

  //honestly. might aswell treat all points as equals..
  f("poi", "labels.icon", "#00ffff"), //ikonen
  f("poi", "labels.text", "#ff0000"),
  f("poi", "labels.text.stroke", "#ffffff"), //also icon stroke?
  f("poi", "geometry.fill", "#ffff00"), //färg på lekplats etc
  f("poi", "geometry.stroke", "#ff00ff"), //does nothing?
  /*
  f("poi.attraction", "geometry.fill", "#ff0000"),
  f("poi.attraction", "geometry.stroke", "#ff0000"),
  f("poi.attraction", "labels.icon", "#ff0000"),
  f("poi.attraction", "labels.text", "#ff0000"),
  f("poi.attraction", "labels.text.fill", "#ff0000"),
  f("poi.attraction", "labels.text.stroke", "#ff0000"),

  //business names.. disable?.. if so, might aswell disable in base style and not touch it from js
  f("poi.business", "geometry.fill", "#ff0000"),
  f("poi.business", "geometry.stroke", "#ff0000"),
  f("poi.business", "labels.icon", "#ff0000"),
  f("poi.business", "labels.text", "#ff0000"),
  f("poi.business", "labels.text.fill", "#ff0000"),
  f("poi.business", "labels.text.stroke", "#ff0000"),

  f("poi.government", "geometry.fill", "#ff0000"),
  f("poi.government", "geometry.stroke", "#ff0000"),
  f("poi.government", "labels.icon", "#ff0000"),
  f("poi.government", "labels.text", "#ff0000"),
  f("poi.government", "labels.text.fill", "#ff0000"),
  f("poi.government", "labels.text.stroke", "#ff0000"),
  */

  /*
  f("poi.medical", "geometry.fill", "#ff0000"),
  f("poi.medical", "geometry.stroke", "#ff0000"),
  f("poi.medical", "labels.icon", "#ff0000"),
  f("poi.medical", "labels.text", "#ff0000"),
  f("poi.medical", "labels.text.fill", "#ff0000"),
  f("poi.medical", "labels.text.stroke", "#ff0000"),

  //park och lekplats
  f("poi.park", "geometry.fill", "#ff0000"),
  f("poi.park", "geometry.stroke", "#ff0000"),
  f("poi.park", "labels.icon", "#ff0000"),
  f("poi.park", "labels.text", "#ff0000"),
  f("poi.park", "labels.text.fill", "#ff0000"),
  f("poi.park", "labels.text.stroke", "#ff0000"),
  */
  /*
  f("poi.place_of_worship", "geometry.fill", "#ff0000"),
  f("poi.place_of_worship", "geometry.stroke", "#ff0000"),
  f("poi.place_of_worship", "labels.icon", "#ff0000"),
  f("poi.place_of_worship", "labels.text", "#ff0000"),
  f("poi.place_of_worship", "labels.text.fill", "#ff0000"),
  f("poi.place_of_worship", "labels.text.stroke", "#ff0000"),

  f("poi.school", "geometry.fill", "#ff0000"),
  f("poi.school", "geometry.stroke", "#ff0000"),
  f("poi.school", "labels.icon", "#ff0000"),
  f("poi.school", "labels.text", "#ff0000"),
  f("poi.school", "labels.text.fill", "#ff0000"),
  f("poi.school", "labels.text.stroke", "#ff0000"),

  f("poi.sports_complex", "geometry.fill", "#ff0000"),
  f("poi.sports_complex", "geometry.stroke", "#ff0000"),
  f("poi.sports_complex", "labels.icon", "#ff0000"),
  f("poi.sports_complex", "labels.text", "#ff0000"),
  f("poi.sports_complex", "labels.text.fill", "#ff0000"),
  f("poi.sports_complex", "labels.text.stroke", "#ff0000"),
  */

  //road
  f("road.arterial", "geometry.fill", "#ff0000"),
  f("road.arterial", "geometry.stroke", "#ff0000"),
  f("road.arterial", "labels.icon", "#ff0000"),
  f("road.arterial", "labels.text", "#ff0000"),
  f("road.arterial", "labels.text.fill", "#ff0000"),
  f("road.arterial", "labels.text.stroke", "#ff0000"),

  f("road.highway", "geometry.fill", "#ff0000"),
  f("road.highway", "geometry.stroke", "#ff0000"),
  f("road.highway", "labels.icon", "#ff0000"),
  f("road.highway", "labels.text", "#ff0000"),
  f("road.highway", "labels.text.fill", "#ff0000"),
  f("road.highway", "labels.text.stroke", "#ff0000"),

  f("road.highway.controlled_access", "geometry.fill", "#ff0000"),
  f("road.highway.controlled_access", "geometry.stroke", "#ff0000"),
  f("road.highway.controlled_access", "labels.icon", "#ff0000"),
  f("road.highway.controlled_access", "labels.text", "#ff0000"),
  f("road.highway.controlled_access", "labels.text.fill", "#ff0000"),
  f("road.highway.controlled_access", "labels.text.stroke", "#ff0000"),

  f("road.local", "geometry.fill", "#ff0000"),
  f("road.local", "geometry.stroke", "#ff0000"),
  f("road.local", "labels.icon", "#ff0000"),
  f("road.local", "labels.text", "#ff0000"),
  f("road.local", "labels.text.fill", "#ff0000"),
  f("road.local", "labels.text.stroke", "#ff0000"),

  //transit, h0nestly. style the same..
  f("transit", "geometry.fill", "#ff00ff"),
  f("transit", "geometry.stroke", "#ff00ff"),
  f("transit", "labels.icon", "#ff00ff"),
  f("transit", "labels.text", "#ff00ff"),
  f("transit", "labels.text.fill", "#ff00ff"),
  f("transit", "labels.text.stroke", "#ff00ff"),

  //leave water untouched?
  //f("water", "geometry.fill", "#ff00ff"),
  //f("water", "geometry.stroke", "#ff00ff"),
  //f("water", "labels.icon", "#ff00ff"),
  //f("water", "labels.text", "#ff00ff"),
  //f("water", "labels.text.fill", "#ff00ff"),
  //f("water", "labels.text.stroke", "#ff00ff"),
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
  | "poi"
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
  | "transit"
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
