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
  const endDate = new Date(event.date.getTime() + 1000 * 60 * 60 * 2); //dont have endDate on events yet... go 2 hours for now

  const ldjson = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    //"url": url,
    //"eventStatus": "EventScheduled", //google defaults to this, or actually they default to "https://schema.org/EventScheduled", not sure if difference
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "organizer": [
      {
        "@type": "Person",
        "name": event.creatorName,
        "url": creatorUrl,
      },
    ],
    "description": description,
    "startDate": iso8601DateTime(event.date),
    "endDate": iso8601DateTime(endDate),
    //"duration": "P0Y0M0DT0H16M7S",
    //"image": event.image ? [event.image] : undefined, //how to know if this image is safe? google might block the site or smth
    "location": event.locationName
      ? {
          "@type": "Place",
          "name": event.locationName,
          //schema.org allows types "Text" or "PostalAdress" here but google reads it as "PostalAdress" either way. which is supposed to be "The mailing adress" of the place.
          //not including this is fine? also google also supports VirtualLocation
          //see google example: https://developers.google.com/search/docs/appearance/structured-data/event#mixed-online-event
          //and schema.org spec: https://schema.org/VirtualLocation
          //"address": event.locationName ?? "anywhere",
          //The proper thing to do would be to get the actual adress from latLng, without letting user modify it
          //and only include this location field if latLng exists
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
