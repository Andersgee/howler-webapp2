import { type GeoJson } from "#src/db/types-geojson";

// geojson uses [lng,lat] array but google-maps uses {lat,lng} object
// I keep mistyping order so always use these.

export function pointFromlatLngLiteral(latLng: google.maps.LatLngLiteral): GeoJson["Point"] {
  return { type: "Point", coordinates: [latLng.lng, latLng.lat] };
}
export function pointFromlatLng(latLng: google.maps.LatLng): GeoJson["Point"] {
  return { type: "Point", coordinates: [latLng.lng(), latLng.lat()] };
}

export function latLngLiteralFromPoint(point: GeoJson["Point"]): google.maps.LatLngLiteral {
  return { lat: point.coordinates[1], lng: point.coordinates[0] };
}

export function latLngFromPoint(point: GeoJson["Point"]): google.maps.LatLng {
  return new google.maps.LatLng(point.coordinates[1], point.coordinates[0]);
}
