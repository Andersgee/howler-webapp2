"use client";

import { PrettyDate } from "#src/components/PrettyDate";
import { type RouterOutputs, api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";

type Props = {
  className?: string;
  initialData: RouterOutputs["event"]["latest"];
};

export function Wall({ initialData, className }: Props) {
  const eventLatest = api.event.latest.useQuery(undefined, {
    initialData,
  });

  return (
    <div className={cn("", className)}>
      <h1>latest 10 events</h1>
      {eventLatest.data.map((event) => (
        <div key={event.id}>
          <Link prefetch={false} href={`/event/${hashidFromId(event.id)}`} className="block">
            <h2>{event.title}</h2>
          </Link>

          <PrettyDate date={event.createdAt} />
        </div>
      ))}
    </div>
  );
}
