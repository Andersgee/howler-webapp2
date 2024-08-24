import "dotenv/config";
import "#src/utils/validate-process-env.mjs";
import { getGoogleReverseGeocodingFromPlaceId } from "#src/lib/geocoding";

async function main() {
  const placeId = "ChIJexAZtTbB5zsRyA--VJe5UoQ";
  const a = await getGoogleReverseGeocodingFromPlaceId(placeId);
  console.log(a);
}

void main();
