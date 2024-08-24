import { z } from "zod";

//https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding#reverse-status-codes
//https://developers.google.com/maps/documentation/geocoding/requests-geocoding#Types

const RESULT_TYPES = [
  "street_address",
  "route",
  "intersection",
  "political",
  "country",
  "administrative_area_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "administrative_area_level_4",
  "administrative_area_level_5",
  "administrative_area_level_6",
  "administrative_area_level_7",
  "colloquial_area",
  "locality",
  "sublocality",
  "neighborhood",
  "premise",
  "subpremise",
  "plus_code",
  "postal_code",
  "natural_feature",
  "airport",
  "park",
  "point_of_interest",
] as const;

const schemaResultType = z.enum(RESULT_TYPES);

//adress components have some extra, and this list is not exhaustive, and it might change
//I just copy pasted these cuz can atleast filter out some specific types that I dont want
const schemaAdressComponentType = z.enum([
  ...RESULT_TYPES,
  "floor",
  "establishment",
  "landmark",
  "parking",
  "post_box",
  "postal_town",
  "room",
  "street_number",
]);
export type AdressComponentType = z.infer<typeof schemaAdressComponentType>;

const zGeometry = z.object({
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  location_type: z.string(), //enum?
  viewport: z.object({
    northeast: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    southwest: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
});

const zAdressComponent = z.object({
  long_name: z.string(),
  short_name: z.string(),
  types: z.array(schemaAdressComponentType.or(z.string())),
});

export const schemaReverseGeoCodingResponse = z.object({
  status: z.enum(["OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", "REQUEST_DENIED", "INVALID_REQUEST", "UNKNOWN_ERROR"]),
  plus_code: z.object({
    compound_code: z.string(),
    global_code: z.string(),
  }),
  results: z.array(
    z.object({
      formatted_address: z.string(), //"not just postal addresses, but any way to geographically name a location"
      address_components: z.array(zAdressComponent),
      geometry: zGeometry,
      place_id: z.string(),
      types: z.array(schemaResultType.or(z.string())),
      plus_code: z
        .object({
          compound_code: z.string(),
          global_code: z.string(),
        })
        .optional(),
    })
  ),
});

export type ReverseGeoCodingResponse = z.infer<typeof schemaReverseGeoCodingResponse>;

export const schemaReverseGeoCodingPlaceIdResponse = z.object({
  status: z.enum(["OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", "REQUEST_DENIED", "INVALID_REQUEST", "UNKNOWN_ERROR"]),
  results: z.array(
    z.object({
      formatted_address: z.string(), //"not just postal addresses, but any way to geographically name a location"
      address_components: z.array(zAdressComponent),
      geometry: zGeometry,
      place_id: z.string(),
      types: z.array(schemaResultType.or(z.string())),
    })
  ),
});
