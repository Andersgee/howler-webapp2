import { apiRscPublic } from "#src/trpc/api-rsc-public";
import { hashidFromId, idFromHashid } from "#src/utils/hashid";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <div>
      <div>
        {joinedUsers.map((user) => (
          <Link key={user.id} href={`/profile/${hashidFromId(user.id)}`} prefetch={false} className="block">
            {user.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
