import { z } from "zod";

export const zPlacesAutocompleteResponse = z.object({
  suggestions: z.array(
    z.object({
      placePrediction: z.object({
        place: z.string(),
        placeId: z.string(),
        //text: z.object({
        //  text: z.string(),
        //  matches: z.array(z.object({ endOffset: z.number() })),
        //}),
        structuredFormat: z.object({
          mainText: z.object({
            text: z.string(),
            matches: z.array(z.object({ endOffset: z.number() })),
          }),
          secondaryText: z.object({
            text: z.string(),
          }),
        }),
        types: z.array(z.string()),
        //distanceMeters: z.number(),
      }),
    })
  ),
});
