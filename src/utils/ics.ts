export function downloadEventAsIcal(hashid: string) {
  const filename = `howler-event-${hashid}.ics`;

  const value = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HOWLER//EVENT//EN
BEGIN:VEVENT
UID:howler-event-Brv7e
SUMMARY:Titta på film
DTSTAMP:20240327T230316Z
DTSTART:20240329T230316Z
GEO:48.85299;2.36885
END:VEVENT
END:VCALENDAR`;
  const file = new File([value], filename, { type: "text/calendar" });

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
