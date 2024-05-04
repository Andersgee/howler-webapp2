import { apiRsc } from "#src/trpc/api-rsc";
import { apiRscPublic } from "#src/trpc/api-rsc-public";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import { notFound } from "next/navigation";
import { seo } from "#src/utils/seo";
import { type ResolvingMetadata } from "next";
import { UserImage96x96 } from "#src/components/user/UserImage";
import Link from "next/link";
import { Eventinfo } from "#src/app/event/[hashid]/Eventinfo";
import { FollowUnfollowButton } from "./FollowUnfollowButton";
import { Shell } from "#src/components/Shell";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api } = apiRscPublic();
  const user = await api.user.infoPublic({ userId: id });
  if (!user) notFound();

  //const previousImages = (await parent).openGraph?.images ?? []

  return seo({
    title: `${user.name} | Profile | Howler`,
    description: `profile ${user.name}`, //"Quickly find/plan stuff to do with friends, or with anyone really.",
    url: `/profile/${params.hashid}`,
    image: "/howler.png",
  });
}

export default async function Page({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api, user } = await apiRsc();
  const profile = await api.user.infoPublic({ userId: id });
  if (!profile) notFound();

  const isFollowing = user ? await api.user.meIsFollowing({ id: profile.id }) : false;
  const events = await api.event.latestByUserId({ userId: profile.id });

  return (
    <Shell>
      <section className="flex flex-col items-center">
        <UserImage96x96 alt={profile.name} image={profile.image ?? ""} />
        <h1 className="mt-2">{`${profile.name}`}</h1>
        {user && user.id !== profile.id && (
          <>
            <FollowUnfollowButton isFollowing={isFollowing} userId={profile.id} />
            {!isFollowing && <p className="text-sm">Follow to get notified when {profile.name} howls</p>}
          </>
        )}
      </section>
      <hr className="py-4" />
      <h2>Events</h2>
      <section className="flex flex-wrap justify-center gap-8">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/event/${hashidFromId(event.id)}`}
            className="block bg-color-neutral-0 hover:bg-color-neutral-300"
          >
            <Eventinfo event={event} className="p-2" />
          </Link>
        ))}
      </section>
    </Shell>
  );
}
