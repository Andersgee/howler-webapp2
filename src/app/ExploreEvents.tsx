import { apiRscPublic } from "#src/trpc/api-rsc";
import { hashidFromId } from "#src/utils/hashid";
import { JSONE } from "#src/utils/jsone";
import Link from "next/link";
import { MapExplore } from "./MapExplore";

export async function ExploreEvents() {
  const { api } = apiRscPublic();
  const events = await api.event.getAll();

  return (
    <div>
      <h1>explore</h1>
      <MapExplore events={events} />
      {events.map((event) => (
        <div key={event.id} className="p-2">
          <Link href={`/event/${hashidFromId(event.id)}`}>
            <h2>{event.title}</h2>
          </Link>
          <div>{event.title}</div>
        </div>
      ))}
      <pre>{JSONE.stringify(events, 2)}</pre>
    </div>
  );
}
