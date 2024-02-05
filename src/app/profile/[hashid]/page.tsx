import { apiRsc, apiRscPublic } from "#src/trpc/api-rsc";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import { notFound } from "next/navigation";
import { seo } from "#src/utils/seo";
import { type ResolvingMetadata } from "next";
import { UserImage96x96 } from "#src/components/user/UserImage";
import { Button } from "#src/ui/button";
import Link from "next/link";
import { Eventinfo } from "#src/app/event/[hashid]/Eventinfo";
import { revalidateTag } from "next/cache";
import { FollowUnfollowButton } from "./FollowUnfollowButton";

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

  const { api, user: tokenUser } = await apiRsc();
  const user = await api.user.infoPublic({ userId: id });
  if (!user) notFound();

  const isFollowing = tokenUser ? await api.user.meIsFollowing({ id: user.id }) : false;
  const events = await api.event.latestByUserId({ userId: user.id });

  return (
    <div className="flex justify-center">
      <div className="px-2">
        <section className="flex flex-col items-center">
          <UserImage96x96 alt={user.name} image={user.image ?? ""} />
          <h1 className="mt-2">{`${user.name}`}</h1>
          {tokenUser && tokenUser.id !== user.id ? (
            <FollowUnfollowButton isFollowing={isFollowing} userId={user.id} />
          ) : null}
        </section>
        <hr className="py-2" />
        <section>
          {events.map((event) => (
            <Link key={event.id} href={`/event/${hashidFromId(event.id)}`}>
              <Eventinfo event={event} className="p-2" />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
