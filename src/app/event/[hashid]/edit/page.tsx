import { apiRsc } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import { notFound, redirect } from "next/navigation";
import { UpdateEventForm } from "./UpdateEventForm";
import { EventImage } from "./EventImage";

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
    <div className="container mx-auto flex justify-center">
      <div className="flex w-full flex-col items-center">
        <h1>Edit Event</h1>
        <EventImage event={event} />
        <UpdateEventForm initialEvent={event} />
      </div>
    </div>
  );
}
