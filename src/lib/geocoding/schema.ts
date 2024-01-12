import { z } from "zod";

//https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding#reverse-status-codes
export const schemaReverseGeoCodingResponse = z.object({
  status: z.enum(["OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", "REQUEST_DENIED", "INVALID_REQUEST", "UNKNOWN_ERROR"]),
  plus_code: z.object({
    compound_code: z.string(),
    global_code: z.string(),
  }),
  results: z.array(
    z.object({
      formatted_address: z.string(), //"not just postal addresses, but any way to geographically name a location"
      address_components: z.array(
        z.object({
          long_name: z.string(),
          short_name: z.string(),
          types: z.array(z.string()), //enum?
        })
      ),
      geometry: z.object({
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
      }),
      place_id: z.string(),
      plus_code: z
        .object({
          compound_code: z.string(),
          global_code: z.string(),
        })
        .optional(),
      types: z.array(z.string()),
    })
  ),
});

export type ReverseGeoCodingResponse = z.infer<typeof schemaReverseGeoCodingResponse>;
