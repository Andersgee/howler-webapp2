import { schemaReverseGeoCodingResponse, type ReverseGeoCodingResponse, type AdressComponentType } from "./schema";

export async function getGoogleReverseGeocoding(p: { lng: number; lat: number }) {
  const key = process.env.GOOGLE_GEOCODING_API_KEY;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${p.lat},${p.lng}&key=${key}`;
    const data = schemaReverseGeoCodingResponse.parse(await fetch(url).then((res) => res.json()));
    if (data.status !== "OK") {
      throw new Error(data.status);
    }

    //return findSimpleName(data);
    //return data.results[0]?.formatted_address ?? null;
    return nameList(data);
  } catch (error) {
    return null;
  }
}

function nameList(data: ReverseGeoCodingResponse) {
  const ignoredTypes: AdressComponentType[] = ["plus_code", "country", "floor", "postal_code", "premise"];
  const s = new Set<string>();
  for (const result of data.results) {
    const ignoreResult = ignoredTypes.some((t) => result.types.includes(t));
    if (!ignoreResult) {
      s.add(result.formatted_address);
    }
    for (const address_component of result.address_components) {
      const ignoreComponent = ignoredTypes.some((t) => address_component.types.includes(t));
      if (!ignoreComponent) {
        s.add(address_component.short_name);
        s.add(address_component.long_name);
      }
    }
  }
  return Array.from(s);
}

/*
function findSimpleName(data: ReverseGeoCodingResponse) {
  //could use the "formatted_adress" but its a bit to formal
  for (const result of data.results) {
    for (const address_component of result.address_components) {
      const isNotPlusCode = address_component.types[0] !== "plus_code";
      if (isNotPlusCode && !hasNumbers(address_component.long_name) && startsWithLetter(address_component.long_name)) {
        return address_component.long_name;
      }
      if (
        isNotPlusCode &&
        !hasNumbers(address_component.short_name) &&
        startsWithLetter(address_component.short_name)
      ) {
        return address_component.short_name;
      }
    }
  }
  return null;
}


function hasNumbers(str: string) {
  return str
    .split(" ")
    .map((x) => !isNaN(Number(x)))
    .some(Boolean);
}

function startsWithLetter(str: string) {
  if (str.length < 1) return false;
  return isNaN(Number(str[0]));
}
*/
