import { apiRscPublic } from "#src/trpc/api-rsc";
import { hashidFromId } from "#src/utils/hashid";
import { JSONE } from "#src/utils/jsone";
import Link from "next/link";

export async function ExploreEvents() {
  const { api } = apiRscPublic();
  const initialData = await api.event.latest();

  return (
    <div>
      <h1>explore</h1>
      {initialData.map((event) => (
        <div key={event.id} className="p-2">
          <Link href={`/event/${hashidFromId(event.id)}`}>
            <h2>{event.title}</h2>
          </Link>
          <div>{event.title}</div>
        </div>
      ))}
      <pre>{JSONE.stringify(initialData, 2)}</pre>
    </div>
  );
}
