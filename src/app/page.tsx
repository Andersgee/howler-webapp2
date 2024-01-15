import { apiRscPublic } from "#src/trpc/api-rsc";
import { MapExplore } from "./MapExplore";

export default async function Page() {
  const { api } = apiRscPublic();
  const events = await api.event.getAll();

  return <MapExplore initialEvents={events} />;
}
