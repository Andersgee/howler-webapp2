import { Shell } from "#src/components/Shell";
import { seo } from "#src/utils/seo";
import { CreateEventForm } from "./CreateEventForm";

export const metadata = seo({
  title: "Create | Howler",
  description: "Quickly find/plan stuff to do with friends, or with anyone really.",
  url: "/event",
  image: "/howler.png",
});

export default function Page() {
  return (
    <Shell>
      <div className="py-4"></div>
      <CreateEventForm />
    </Shell>
  );
}
