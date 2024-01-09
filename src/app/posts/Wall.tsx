"use client";

import { PrettyDate } from "#src/components/PrettyDate";
import { type RouterOutputs, api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  initialData: RouterOutputs["post"]["latest"];
};

export function Wall({ initialData, className }: Props) {
  const postLatest = api.post.latest.useQuery(undefined, {
    initialData,
  });

  return (
    <div className={cn("", className)}>
      {postLatest.data.map((post) => (
        <div key={post.id}>
          <p>{post.text}</p>
          <div>
            <PrettyDate date={post.createdAt} />
          </div>
        </div>
      ))}
    </div>
  );
}
