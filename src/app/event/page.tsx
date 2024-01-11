import { apiRscPublic } from "#src/trpc/api-rsc";
import { Create } from "./Create";
import { Wall } from "./Wall";

export default async function Page() {
  const { api } = apiRscPublic();
  const initialData = await api.event.latest();
  return (
    <div>
      <h1>latest 10 events</h1>
      <Create />
      <Wall initialData={initialData} />
    </div>
  );
}
