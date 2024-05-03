import { apiRsc } from "#src/trpc/api-rsc";
import { apiRscPublic } from "#src/trpc/api-rsc-public";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import { notFound } from "next/navigation";
import { Eventinfo } from "./Eventinfo";
import { EventActions } from "./EventActions";
import Image from "next/image";
import { imageSizes } from "#src/utils/image-sizes";
//import { base64 } from "rfc4648";
import { seo } from "#src/utils/seo";
import { type ResolvingMetadata } from "next";
import { RichResults } from "./RichResults";
import Link from "next/link";
import { Shell } from "#src/components/Shell";
import { CreateCommentForm } from "./CreateCommentForm";
import { CommentsList, PinnedComment } from "./CommentsList";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api } = apiRscPublic();
  const event = await api.event.getById({ id });
  if (!event) notFound();

  //const previousImages = (await parent).openGraph?.images ?? []

  return seo({
    title: `${event.title} | Howler`,
    description: `Howl by ${event.creatorName}`, //"Quickly find/plan stuff to do with friends, or with anyone really.",
    url: `/event/${params.hashid}`,
    image: `/event/${params.hashid}/image.png`,
  });
}

//function blurDataURLstring(data: Uint8Array) {
//  return `data:image/png;base64,${base64.stringify(data)}`;
//}

export default async function Page({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api, user } = await apiRsc();
  const event = await api.event.getById({ id });
  if (!event) notFound();

  const isJoined = user ? await api.event.meIsJoined({ id }) : false;
  const isFollowing = user ? await api.user.meIsFollowing({ id: event.creatorId }) : false;

  return (
    <>
      <RichResults event={event} />
      <Shell>
        {event.image ? (
          <div className="flex justify-center">
            <Image
              priority
              src={event.image}
              alt={event.title}
              sizes={imageSizes("w-64", { md: "w-96" })}
              className="mb-8 h-auto w-64 md:w-96"
              //width and height only for aspect ratio purpose
              width={256}
              height={Math.round(256 / event.imageAspect)}
              //placeholder={event.imageBlurData ? "blur" : undefined}
              //blurDataURL={event.imageBlurData ? blurDataURLstring(event.imageBlurData) : undefined}
            />
          </div>
        ) : (
          <div className="py-4"></div>
        )}

        <Eventinfo event={event} />
        <EventActions
          event={event}
          user={user}
          isCreator={user?.id === event.creatorId}
          isJoined={isJoined}
          isFollowing={isFollowing}
        />
        <div className="text-balance pb-2 text-center text-color-neutral-600">
          Event created by{" "}
          <Link
            href={`/profile/${hashidFromId(event.creatorId)}`}
            className="underline decoration-dotted hover:decoration-solid"
          >
            {event.creatorName}
          </Link>
        </div>
        <div className="py-6"></div>
        {event.pinnedCommentId !== null ? (
          <PinnedComment commentId={event.pinnedCommentId} user={user} eventCreatorId={event.creatorId} />
        ) : null}
        <CreateCommentForm user={user} eventId={event.id} />
        <CommentsList user={user} event={event} />
      </Shell>
    </>
  );
}
