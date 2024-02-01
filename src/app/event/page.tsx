import { apiRsc } from "#src/trpc/api-rsc";
import { seo } from "#src/utils/seo";
import { CreateEventForm } from "./CreateEventForm";

export const metadata = seo({
  title: "Create | Howler",
  description: "Quickly find/plan stuff to do with friends, or with anyone really.",
  url: "/event",
  image: "/howler.png",
});

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
