import { latLngLiteralFromPoint } from "#src/components/GoogleMaps/google-maps-point-latlng";
import { type RouterOutputs } from "#src/hooks/api";
import { iso8601DateTime } from "#src/utils/ISO-8601";
import { hashidFromId } from "#src/utils/hashid";
import { absUrl } from "#src/utils/url";
import Script from "next/script";

/*
https://developers.google.com/search/docs/appearance/structured-data/article
https://developers.google.com/search/docs/appearance/structured-data/article#article-types
image WebP is ok, see supported image formats: https://developers.google.com/search/docs/appearance/google-images#supported-image-formats
optional datePublished must be in ISO 8601 format. (which is basically date.toISOString())
more specifically: DateTime: A combination of date and time of day in the form [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm] (see Chapter 5.4 of ISO 8601).

test if the structured data is valid:
https://search.google.com/test/rich-results

also general inspect url and what google currently has in index for your page:
https://support.google.com/webmasters/answer/9012289

google recommends JSON-LD for rich results
The schema.org spec: https://schema.org/docs/full.html
in particular: https://schema.org/Event
       or even https://schema.org/SocialEvent

see googles example of Event type here: https://developers.google.com/search/docs/appearance/structured-data/event

*/

type Props = {
  event: NonNullable<RouterOutputs["event"]["getById"]>;
};

export function RichResults({ event }: Props) {
  //const url = absUrl(`/event/${hashidFromId(event.id)}`);
  const creatorUrl = absUrl(`/profile/${hashidFromId(event.creatorId)}`);
  const description = `${event.title} ${event.locationName}`;
  const latLng = event.location ? latLngLiteralFromPoint(event.location) : null;
  //const endDate = new Date(event.date.getTime() + 1000 * 60 * 60 * 2); //dont have endDate on events yet... go 2 hours for now

  const ldjson = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    //"url": url,
    //"eventStatus": "EventScheduled", //google defaults to this, or actually they default to "https://schema.org/EventScheduled", not sure if difference
    //"eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "organizer": [
      {
        "@type": "Person",
        "name": event.creatorName,
        "url": creatorUrl,
      },
    ],
    "description": description,
    "startDate": iso8601DateTime(event.date),
    //"endDate": iso8601DateTime(endDate),
    //"duration": "P0Y0M0DT0H16M7S",
    //"image": event.image ? [event.image] : undefined, //how to know if this image is safe? google might block the site or smth
    //see https://developers.google.com/search/docs/appearance/structured-data/event#structured-data-type-definitions
    // location has requirements from googles bots...
    // if type is "Place" then "adress" is required, which google reads as a "PostalAdress" type even though schema.org alowws just "Text" type
    // if type is "VirtualLocation" then "url" is required
    // btw its fine to use an array "location": [{},{}] if its a mix
    "location": event.locationName
      ? {
          "@type": "Place",
          "name": event.locationName,
          //"address": {
          //  "@type": "PostalAddress",
          //  "name": "some detailed street adress",
          //},
          "geo": latLng
            ? {
                "@type": "GeoCoordinates",
                "latitude": latLng.lat.toString(),
                "longitude": latLng.lng.toString(),
              }
            : undefined,
        }
      : undefined,
  };

  return (
    <Script id={`ldjson-${hashidFromId(event.id)}`} type="application/ld+json">
      {`${JSON.stringify(ldjson)}`}
    </Script>
  );
}
