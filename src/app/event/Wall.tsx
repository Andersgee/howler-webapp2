"use client";

import { PrettyDate } from "#src/components/PrettyDate";
import { type RouterOutputs, api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";
import { JSONE } from "#src/utils/jsone";

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
      {eventLatest.data.map((event) => (
        <div key={event.id}>
          <h2>{event.title}</h2>
          <div>
            <PrettyDate date={event.createdAt} />
          </div>
          <pre>{JSONE.stringify(event, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
