"use client";

import { UserImage32x32 } from "#src/components/user/UserImage";
import { type RouterOutputs, api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { IconLoadingSpinner } from "#src/icons/special";
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

  const ref = useIntersectionObserverCallback(
    ([entry]) => {
      const isVisible = !!entry?.isIntersecting;
      if (isVisible) {
        console.log("isVisible");
        if (!isFetchingNextPage && hasNextPage) {
          console.log("calling fetchNextPage()");
          void fetchNextPage();
        }
      }
    },
    [isFetchingNextPage, hasNextPage]
  );

  return (
    <div className={cn("", className)}>
      {data?.pages
        .map((page) => page.items)
        .flat()
        .map((comment) => <Comment key={comment.id} comment={comment} />)}
      <div ref={ref} className="min-h-[1px] min-w-[1px]"></div>
      <div className="flex justify-center p-2">
        {hasNextPage ? (
          isFetchingNextPage ? (
            <IconLoadingSpinner />
          ) : (
            <div>more...</div>
          )
        ) : (
          <div>{data && data.pages.length > 1 ? "you have reached the end" : ""}</div>
        )}
      </div>
    </div>
  );
}

function Comment({ comment }: { comment: RouterOutputs["comment"]["infinite"]["items"][number] }) {
  return (
    <div className="flex">
      <UserImage32x32 image={comment.userImage} alt={comment.userName} />
      <div>
        <div>{comment.userName}</div>
        <pre className="max-w-[55ch] whitespace-pre-wrap font-sans text-color-neutral-800">{comment.text}</pre>
      </div>
    </div>
  );
}
