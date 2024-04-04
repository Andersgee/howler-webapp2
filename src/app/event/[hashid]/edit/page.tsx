import { apiRsc } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import { notFound, redirect } from "next/navigation";
import { UpdateEventForm } from "./UpdateEventForm";
import { EventImage } from "./EventImage";
import { Shell } from "#src/components/Shell";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export default async function Page({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api, user } = await apiRsc();
  const event = await api.event.getById({ id });
  if (!event) notFound();

  if (!user?.id || user.id !== event.creatorId) redirect(`/event/${params.hashid}`);

  return (
    <Shell>
      <h1>Edit Event</h1>
      <div className="flex justify-center">
        <EventImage event={event} />
      </div>
      <UpdateEventForm initialEvent={event} />
    </Shell>
  );
}
