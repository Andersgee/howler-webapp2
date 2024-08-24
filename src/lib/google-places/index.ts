import { zPlacesAutocompleteResponse } from "./schema";

/**
 * the places api is better than geocoding api
 *
 * places api is designed with autocomplete, locationbias, distance from point etc
 *
 * https://developers.google.com/maps/documentation/places/web-service/place-autocomplete?hl=en
 *
 * "If you omit both locationBias and locationRestriction, then the API uses IP biasing by default"
 */
export async function getGooglePlacesAutocomplete(str: string, abortController?: AbortController) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  try {
    const data = zPlacesAutocompleteResponse.parse(
      await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        signal: abortController?.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
        },
        body: JSON.stringify({
          input: str,
          //adding an origin makes response include "distanceMeters"
          //origin: {
          //  latitude: 37.7749,
          //  longitude: -122.4194,
          //},
        }),
      }).then((res) => res.json())
    );

    const suggestions = data.suggestions.map((x) => x.placePrediction);
    return suggestions;
  } catch (error) {
    //console.log(error);
    return null;
  }
}
