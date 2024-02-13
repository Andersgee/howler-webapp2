"use client";

import { api } from "#src/hooks/api";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";

type Props = {
  eventId: bigint;
};

export function EventinfoWho({ eventId }: Props) {
  const { data } = api.event.joinedUsersCount.useQuery({ id: eventId });

  return (
    <div className="flex">
      <span className="mr-1">anyone</span>
      {data && data.count > 0 ? (
        <Link
          className="block underline decoration-dotted duration-500 animate-in fade-in"
          href={`/event/${hashidFromId(eventId)}/people`}
        >{`(${data.count} people joined)`}</Link>
      ) : null}
    </div>
  );
}
