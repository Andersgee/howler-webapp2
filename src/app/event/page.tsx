import { apiRsc } from "#src/trpc/api-rsc";
import { CreateEventForm } from "./CreateEventForm";

export default async function Page() {
  const { user } = await apiRsc();
  return (
    <div className="container mx-auto flex justify-center">
      <div>
        <h1>create</h1>
        <CreateEventForm isSignedIn={!!user} />
      </div>
    </div>
  );
}
