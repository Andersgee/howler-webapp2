"use client";

import { api } from "#src/hooks/api";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";

type Props = {
  eventId: bigint;
};

export function EventinfoWho({ eventId }: Props) {
  const { data: count } = api.event.joinedUsersCount.useQuery({ id: eventId });

  if (!count || count < 1) {
    return <div>anyone</div>;
  }

  return (
    <div>
      anyone{" "}
      <Link
        //className={buttonVariants({ variant: "outline" })}
        href={`/event/${hashidFromId(eventId)}/people`}
      >{`(${count}) people joined`}</Link>
    </div>
  );
}
