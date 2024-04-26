"use client";

import { PrettyDate } from "#src/components/PrettyDate";
import { UserImage32x32 } from "#src/components/user/UserImage";
import { type RouterOutputs, api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { IconLoadingSpinner } from "#src/icons/special";
import { cn } from "#src/utils/cn";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";

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
    <div className={cn("max-w-[384px]", className)}>
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
    <div className="flex gap-2 py-3">
      <Link prefetch={false} className="block" href={`/profile/${hashidFromId(comment.userId)}`}>
        <UserImage32x32 image={comment.userImage} alt={comment.userName} />
      </Link>
      <div>
        <div className="flex items-baseline">
          <h3 className="text-base text-color-neutral-800">{comment.userName}</h3>
          <span className="ml-2 text-sm text-color-neutral-600">{PrettyDate({ date: comment.createdAt })}</span>
        </div>
        <pre className="max-w-[55ch] whitespace-pre-wrap font-sans text-color-neutral-700">{comment.text}</pre>
      </div>
    </div>
  );
}