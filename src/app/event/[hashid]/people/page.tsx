import { Shell } from "#src/components/Shell";
import { UserImage32x32 } from "#src/components/user/UserImage";
import { apiRscPublic } from "#src/trpc/api-rsc-public";
import { buttonVariants } from "#src/ui/button";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import { type Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return { title: "People" };
}

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  params: { hashid: string };
};

export default async function Page({ params }: Props) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const { api } = apiRscPublic();
  //const joinedUsersCount = await api.event.joinedUsersCount({ id });
  const joinedUsers = await api.event.joinedUsers({ id });
  return (
    <Shell>
      <div className="space-y-2">
        {joinedUsers.map((user) => (
          <Link
            key={user.id}
            className="flex items-center gap-2 bg-color-neutral-0 px-3 py-2 hover:bg-color-neutral-200"
            href={`/profile/${hashidFromId(user.id)}`}
            prefetch={false}
          >
            <UserImage32x32 image={user.image} alt={user.name} />
            {user.name}
          </Link>
        ))}
      </div>
      <Link href={`/event/${params.hashid}`} className={buttonVariants({ variant: "icon" })}>
        Back
      </Link>
    </Shell>
  );
}
