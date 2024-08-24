import { getGooglePlacesAutocomplete } from "#src/lib/google-places";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type Suggestions = Awaited<ReturnType<typeof getGooglePlacesAutocomplete>>;

export function useGooglePlacesSuggestions(inputstr: string) {
  const [suggestions, setSuggestions] = useState<Suggestions>(null);

  const [str] = useDebounce(inputstr, 500);

  useEffect(() => {
    const abortController = new AbortController();

    if (str) {
      getGooglePlacesAutocomplete(str, abortController)
        .then(setSuggestions)
        .catch(() => setSuggestions(null));
    } else {
      abortController.abort();
      setSuggestions(null);
    }
    return () => abortController.abort();
  }, [str]);
  return suggestions;
}

/*
export function useGooglePlacesSuggestions(str: string) {
  const [suggestions, setSuggestions] = useState<Suggestions>(null);

  useEffect(() => {
    const abortController = new AbortController();

    if (str) {
      getGooglePlacesAutocomplete(str, abortController)
        .then(setSuggestions)
        .catch(() => setSuggestions(null));
    } else {
      abortController.abort();
      setSuggestions(null);
    }
    return () => abortController.abort();
  }, [str]);
  return suggestions;
}
*/
