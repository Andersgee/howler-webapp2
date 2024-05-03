import { latLngLiteralFromPoint } from "#src/components/GoogleMaps/google-maps-point-latlng";
import type { RouterOutputs } from "#src/hooks/api";
import { hashidFromId } from "#src/utils/hashid";
import { absUrl } from "#src/utils/url";

type Event = NonNullable<RouterOutputs["event"]["getById"]>;
export function icsFromEvent(event: Event) {
  const hashid = hashidFromId(event.id);
  const filename = `howler-event-${hashid}.ics`;

  const summary = event.title.replaceAll("\n", " ");
  const dtstamp = event.createdAt.toISOString().slice(0, 19).replaceAll("-", "").replaceAll(":", "");
  const dtstart = event.date.toISOString().slice(0, 19).replaceAll("-", "").replaceAll(":", "");
  const p = event.location ? latLngLiteralFromPoint(event.location) : undefined;
  const geo = p ? `${p.lat.toFixed(5)};${p.lng.toFixed(5)}` : undefined;
  const location = p ? `${p.lat.toFixed(5)},${p.lng.toFixed(5)}` : undefined; //google calendar doesnt use "GEO", but lat,lng (with comma between) works in "LOCATION" text field
  const eventurl = absUrl(`/event/${hashid}`);

  const endDate = new Date(event.date.getTime() + 1000 * 60 * 60 * 2); //dont have endDate on events yet... go 2 hours for now
  const dtend = endDate.toISOString().slice(0, 19).replaceAll("-", "").replaceAll(":", "");

  //https://www.kanzaki.com/docs/ical/
  const x = ["BEGIN:VCALENDAR"];
  x.push("VERSION:2.0");
  x.push("PRODID:-//HOWLER//EVENT//EN");

  x.push("BEGIN:VEVENT");
  x.push(`UID:howler-event-${hashid}`);
  x.push(`SUMMARY:${summary}`);
  x.push(`DTSTAMP:${dtstamp}Z`);
  x.push(`DTSTART:${dtstart}Z`);
  x.push(`DTEND:${dtend}Z`);
  //x.push(`URL:${eventurl}`);
  x.push(
    `DESCRIPTION:${eventurl}\\nHowl by ${event.creatorName}.\\nWhat: ${event.title}\\nWhere: ${
      event.locationName ?? "anywhere"
    }`
  );
  if (geo) {
    x.push(`GEO:${geo}`);
  }
  if (location) {
    x.push(`LOCATION:${location}`);
  }

  x.push("END:VEVENT");
  x.push("END:VCALENDAR");

  const text = x.join("\n");
  const file = new File([text], filename, { type: "text/calendar" });
  return file;
}
export function downloadEventAsIcs(event: Event) {
  const file = icsFromEvent(event);

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
