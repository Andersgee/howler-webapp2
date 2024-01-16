/*
https://developers.google.com/maps/documentation/javascript/examples/style-array#maps_style_array-typescript

full list here:
https://developers.google.com/maps/documentation/javascript/style-reference
*/

const DARK_MODE: google.maps.MapTypeStyle[] = [];

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

const a = NEUTRAL[50];

type Hmm = {
  /** the features to select for this style modification. Features are geographic characteristics on the map, including roads, parks, bodies of water, and more. If you don't specify a feature, all features are selected. */
  featureType?: string;
  /** the property of the specified feature to select. Elements are sub-parts of a feature, including labels and geometry. If you don't specify an element, all elements of the feature are selected. */
  elementType?: string;
  /** there is a hsl option but hex-color is recommended to not inherit from defaults */
  stylers: [{ color: string }];
};

const EXAMPLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: x.a }] },
  { elementType: "labels.text.fill", stylers: [{ color: x.b }] },
  { elementType: "labels.text.stroke", stylers: [{ color: x.c }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: x.d }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [{ color: x.e }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: x.f }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: x.g }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: x.g }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: x.h }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: x.i }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: x.j }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: x.c }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: x.k }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: x.l }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: x.m }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: x.o }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [{ color: x.p }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: x.q }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: x.g }],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [{ color: x.r }],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [{ color: x.a }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: x.g }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: x.s }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: x.t }],
  },
];
