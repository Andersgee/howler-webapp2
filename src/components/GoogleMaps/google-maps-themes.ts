/*
https://developers.google.com/maps/documentation/javascript/examples/style-array#maps_style_array-typescript

full list here:
https://developers.google.com/maps/documentation/javascript/style-reference
*/

const x = {
  a: "#ebe3cd",
  b: "#523735",
  c: "#f5f1e6",
  d: "#c9b2a6",
  e: "#dcd2be",
  f: "#ae9e90",
  g: "#dfd2ae",
  h: "#93817c",
  i: "#a5b076",
  j: "#447530",
  k: "#fdfcf8",
  l: "#f8c967",
  m: "#e9bc62",
  o: "#e98d58",
  p: "#db8555",
  q: "#806b63",
  r: "#8f7d77",
  s: "#b9d3c2",
  t: "#92998d",
} as const;

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
} as const;

const HIGHLIGHT = {
  "50": "#fdf4ff",
  "100": "#fae8ff",
  "200": "#f5d0fe",
  "300": "#f0abfc",
  "400": "#e879f9",
  "500": "#d946ef",
  "600": "#c026d3",
  "700": "#a21caf",
  "800": "#86198f",
  "900": "#701a75",
  "950": "#4a044e",
} as const;

const PRIMARY = {
  "50": "#ecfeff",
  "100": "#cffafe",
  "200": "#a5f3fc",
  "300": "#67e8f9",
  "400": "#22d3ee",
  "500": "#06b6d4",
  "600": "#0891b2",
  "700": "#0e7490",
  "800": "#155e75",
  "900": "#164e63",
  "950": "#083344",
} as const;

type Hmm = {
  /** the features to select for this style modification. Features are geographic characteristics on the map, including roads, parks, bodies of water, and more. If you don't specify a feature, all features are selected. */
  featureType?: string;
  /** the property of the specified feature to select. Elements are sub-parts of a feature, including labels and geometry. If you don't specify an element, all elements of the feature are selected. */
  elementType?: string;
  /** there is a hsl option but hex-color is recommended to not inherit from defaults */
  stylers: [{ color: string }];
};

//copy paste from https://developers.google.com/maps/documentation/javascript/examples/style-array
//which looks like what the "dark mode on android" is
export const CUSTOM_DARK_MODE: google.maps.MapTypeStyle[] = [
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

export const CUSTOM_LIGHT_MODE: google.maps.MapTypeStyle[] = [
  //some defaults (not selecting featureType)
  { elementType: "geometry", stylers: [{ hue: "#a5f3fc" }] },
  //{ elementType: "labels.text.fill", stylers: [{ hue: NEUTRAL[900] }] },
  //{ elementType: "labels.text.stroke", stylers: [{ hue: NEUTRAL[50] }] },
];

//https://developers.google.com/maps/documentation/javascript/style-reference#style-features
export const CUSTOM_LIGHT_MODE_FIRST_TRY: google.maps.MapTypeStyle[] = [
  //some defaults (not selecting featureType)
  { elementType: "geometry", stylers: [{ color: NEUTRAL[100] }] },
  { elementType: "labels.text.fill", stylers: [{ color: NEUTRAL[900] }] },
  { elementType: "labels.text.stroke", stylers: [{ color: NEUTRAL[50] }] },
  //landscape
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: NEUTRAL[300] }],
  },
  //water
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: NEUTRAL[1000] }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: NEUTRAL[700] }],
  },
  //administrative
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: HIGHLIGHT[700] }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [{ color: HIGHLIGHT[100] }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: HIGHLIGHT[900] }],
  },
  //road
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: PRIMARY[600] }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: PRIMARY[700] }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: PRIMARY[800] }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: PRIMARY[100] }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: PRIMARY[800] }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [{ color: PRIMARY[100] }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: PRIMARY[800] }],
  },
  //point of interest
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: HIGHLIGHT[800] }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: HIGHLIGHT[900] }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: HIGHLIGHT[600] }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: HIGHLIGHT[900] }],
  },
  //transit
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: PRIMARY[600] }],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [{ color: PRIMARY[900] }],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [{ color: PRIMARY[50] }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: PRIMARY[500] }],
  },
];
