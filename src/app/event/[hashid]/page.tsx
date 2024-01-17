import { apiRsc } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import { notFound } from "next/navigation";
import { Eventinfo } from "./Eventinfo";
import { EventActions } from "./EventActions";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export default async function Page({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (!id) notFound();

  const { api, user } = await apiRsc();
  const event = await api.event.getById({ id });

  return (
    <div className="container mx-auto flex justify-center">
      <div className="flex w-full flex-col items-center">
        <h1>Event</h1>
        <Eventinfo event={event} />
        <EventActions event={event} isCreator={user?.id === event.creatorId} />
      </div>
    </div>
  );
}
