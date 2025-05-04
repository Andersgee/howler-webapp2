"use client";

import { api } from "#src/hooks/api";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";

type Props = {
  eventId: bigint;
  who: string | null;
};

export function EventinfoWho({ eventId, who }: Props) {
  const { data } = api.event.joinedUsersCount.useQuery({ id: eventId });

  return (
    <div className="flex">
      <span className="mr-1">{who ? who : "Anyone"}</span>
      {data && data.count > 0 ? (
        <Link
          className="block text-color-neutral-600 underline decoration-dotted duration-500 animate-in fade-in"
          href={`/event/${hashidFromId(eventId)}/people`}
        >{`(${data.count} people joined)`}</Link>
      ) : null}
    </div>
  );
}
