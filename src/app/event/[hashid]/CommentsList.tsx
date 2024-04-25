"use client";

import { api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";

type Props = {
  eventId: bigint;
  className?: string;
};

export function CommentsList({ className, eventId }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.comment.infinite.useInfiniteQuery(
    { eventId },
    {
      //enabled: dialogValue === "notifications",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      //initialCursor: initialPosts.items.at(-1)?.id,
      //initialData: { pages: [initialPosts], pageParams: [] },
    }
  );
  return (
    <div className={cn("", className)}>
      {data?.pages
        .map((page) => page.items)
        .flat()
        .map((comment) => (
          <div key={comment.id}>
            <div className="">
              <div>{comment.userName}</div>
              <pre className="max-w-[55ch] whitespace-pre-wrap font-sans text-color-neutral-800">{comment.text}</pre>
            </div>
            <hr />
          </div>
        ))}
    </div>
  );
}
