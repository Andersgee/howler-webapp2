import { api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { IconLoadingSpinner } from "#src/icons/special";
import { cn } from "#src/utils/cn";
import { type TokenUser } from "#src/utils/jwt/schema";
import { CreateReplyForm } from "./CreateReplyForm";

type Props = {
  user: TokenUser | null;
  eventId: bigint;
  commentId: bigint;
  className?: string;
};

export function RepliesList({ user, className, eventId, commentId }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.reply.infinite.useInfiniteQuery(
    { commentId },
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
        //console.log("isVisible");
        if (!isFetchingNextPage && hasNextPage) {
          //console.log("calling fetchNextPage()");
          void fetchNextPage();
        }
      }
    },
    [isFetchingNextPage, hasNextPage]
  );

  return (
    <div className={cn("max-w-[384px]", className)}>
      <CreateReplyForm user={user} commentId={commentId} eventId={eventId} />
      {data?.pages.flatMap((page) => page.items).map((reply) => <div key={reply.id}>{reply.text}</div>)}
      <div ref={ref} className="min-h-[1px] min-w-[1px]"></div>
      <div className="flex justify-center p-2">
        {hasNextPage ? isFetchingNextPage ? <IconLoadingSpinner /> : <div>more...</div> : null}
      </div>
    </div>
  );
}
