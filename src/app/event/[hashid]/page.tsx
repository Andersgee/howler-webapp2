import { apiRsc } from "#src/trpc/api-rsc";
import { idFromHashid } from "#src/utils/hashid";
import { notFound } from "next/navigation";
import { Eventinfo } from "./Eventinfo";
import { EventActions } from "./EventActions";
import Image from "next/image";
import { imageSizes } from "#src/utils/image-sizes";

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
        {event.image && (
          <Image
            src={event.image}
            alt={event.title}
            sizes={imageSizes("w-64", { md: "w-96" })}
            className="mb-8 h-auto w-64 md:w-96"
            //width and height only for aspect ratio purpose
            width={256}
            height={Math.round(256 / event.imageAspect)}
          />
        )}

        <Eventinfo event={event} />
        <EventActions event={event} isCreator={user?.id === event.creatorId} />
      </div>
    </div>
  );
}
