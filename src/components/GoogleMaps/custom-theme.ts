//tailwind stone, aka light mode color-neutral-x
const NEUTRAL = {
  "0": "#ffffff",
  "50": "#fafaf9",
  "100": "#f5f5f4",
  "200": "#e7e5e4",
  "300": "#d6d3d1",
  "400": "#a8a29e",
  "500": "#78716c",
  "600": "#57534e",
  "700": "#44403c",
  "800": "#292524",
  "900": "#1c1917",
  "950": "#0c0a09",
  "1000": "#000000",
};

const NEUTRAL_DARK = {
  "1000": "#ffffff",
  "950": "#ffffff",
  "900": "#fafaf9",
  "800": "#f5f5f4",
  "700": "#e7e5e4",
  "600": "#d6d3d1",
  "500": "#a8a29e",
  "400": "#78716c",
  "300": "#57534e",
  "200": "#44403c",
  "100": "#292524",
  "50": "#1c1917",
  "0": "#0c0a09",
};

type Hmm = typeof NEUTRAL;

export const HOWLER_MAP_LIGHT = makeTheme(NEUTRAL);
export const HOWLER_MAP_DARK = makeTheme(NEUTRAL_DARK, true);

function makeTheme(NEUTRAL: Hmm, isDark = false): google.maps.MapTypeStyle[] {
  let r = [
    //this is general ground color..
    f("landscape.natural", "geometry.fill", NEUTRAL[50]), //groud color
    f("landscape.natural.landcover", "geometry.fill", NEUTRAL[50]), //ground color.. when zoomed out a bit
    f("landscape.natural.terrain", "geometry.fill", NEUTRAL[50]), //hills ish

    //honestly. might aswell treat all points as equals..
    f("poi", "labels.icon", NEUTRAL[900]), //ikonen
    f("poi", "labels.text", NEUTRAL[900]),
    f("poi", "labels.text.stroke", NEUTRAL[0]), //also icon stroke?
    f("poi", "geometry.fill", NEUTRAL[100]), //färg på lekplats etc
    f("poi", "geometry.stroke", NEUTRAL[0]), //hmm

    //transit, honestly. style the same..
    f("transit", "geometry.fill", NEUTRAL[500]), //railroad etc
    f("transit", "geometry.stroke", NEUTRAL[200]),
    f("transit", "labels.icon", NEUTRAL[900]),
    f("transit", "labels.text", NEUTRAL[900]),
    f("transit", "labels.text.stroke", NEUTRAL[0]),
    //f("transit", "labels.text.fill", "#ff00ff"),

    //road
    f("road", "labels.text", NEUTRAL[700]),
    f("road", "labels.text.stroke", NEUTRAL[0]),
    //f("road", "labels.text.fill", NEUTRAL[700]),
    //f("road", "labels.icon", "")
    f("road.arterial", "geometry.fill", NEUTRAL[0]), //landsväg
    f("road.arterial", "geometry.stroke", NEUTRAL[200]),

    f("road.highway", "geometry.fill", NEUTRAL[0]), //motorväg
    f("road.highway", "geometry.stroke", NEUTRAL[200]),

    f("road.highway.controlled_access", "geometry.fill", NEUTRAL[300]),
    f("road.highway.controlled_access", "geometry.stroke", NEUTRAL[200]),

    f("road.local", "geometry.fill", NEUTRAL[0]),
    f("road.local", "geometry.stroke", NEUTRAL[200]),

    f("administrative", "labels.text", NEUTRAL[900]),
    f("administrative", "labels.text.stroke", NEUTRAL[200]),

    f("administrative.country", "geometry.stroke", NEUTRAL[1000]),
    f("administrative.land_parcel", "geometry.stroke", NEUTRAL[1000]),
    f("administrative.locality", "geometry.stroke", NEUTRAL[1000]),
    f("administrative.neighborhood", "geometry.stroke", NEUTRAL[1000]),
    f("administrative.province", "geometry.stroke", NEUTRAL[1000]),

    //set these on map base style instead (can not set "building color" and "urban area color" separately from javascript)
    //I disabled urban area and put buildings as pure black. should work for both light/dark mode...
    //IF EDITING ANYTHING IN "landscape.man_made" the default style will be replaced
    //f("landscape.man_made", "geometry.fill", ""), //this is "urban area bg" AND "building bg"
    //f("landscape.man_made", "geometry.stroke", """), //this is "business building border"..
  ];
  if (isDark) {
    r = r.concat([
      f("water", "geometry.fill", NEUTRAL[300]),
      f("water", "labels.text", NEUTRAL[700]),
      f("water", "labels.text.stroke", NEUTRAL[0]),
    ]);
  }

  return r;
}

type FeatureType =
  | "administrative"
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
  | "road"
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
