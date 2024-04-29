"use client";

import { PrettyDate } from "#src/components/PrettyDate";
import { UserImage32x32 } from "#src/components/user/UserImage";
import { type RouterOutputs, api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { IconLoadingSpinner } from "#src/icons/special";
import { cn } from "#src/utils/cn";
import { hashidFromId } from "#src/utils/hashid";
import { separateTextUrls } from "#src/utils/separate-text-urls";
import Link from "next/link";
import { CommentOptionsPopover } from "./CommentOptionsPopover";
import { type TokenUser } from "#src/utils/jwt/schema";
import { useState } from "react";
import { EditCommentForm } from "./EditCommentForm";
import { IconPin } from "#src/icons/Pin";

type Props = {
  user: TokenUser | null;
  event: NonNullable<RouterOutputs["event"]["getById"]>;
  className?: string;
};

export function CommentsList({ user, className, event }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.comment.infinite.useInfiniteQuery(
    { eventId: event.id },
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
        .map((comment) =>
          comment.id === event.pinnedCommentId ? null : (
            <Comment user={user} key={comment.id} comment={comment} eventCreatorId={event.creatorId} />
          )
        )}
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

function Comment({
  user,
  comment,
  eventCreatorId,
  isPinned = false,
}: {
  user: TokenUser | null;
  comment: RouterOutputs["comment"]["infinite"]["items"][number];
  eventCreatorId: bigint;
  isPinned?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex gap-2 py-3">
      <Link prefetch={false} className="block" href={`/profile/${hashidFromId(comment.userId)}`}>
        <UserImage32x32 image={comment.userImage} alt={comment.userName} />
      </Link>
      <div>
        <div className="flex items-center">
          <div className="flex items-baseline">
            <h3 className="text-base text-color-neutral-800">{comment.userName}</h3>
            <span className="ml-2 text-sm text-color-neutral-600">{PrettyDate({ date: comment.createdAt })}</span>
          </div>
          <CommentOptionsPopover
            user={user}
            eventCreatorId={eventCreatorId}
            comment={comment}
            onEditClick={() => setIsEditing(true)}
            isPinned={isPinned}
          />
        </div>
        {isEditing ? (
          <EditCommentForm user={user} comment={comment} onStopEditing={() => setIsEditing(false)} />
        ) : (
          <CommentText comment={comment} />
        )}
      </div>
    </div>
  );
}

function CommentText({ comment }: { comment: RouterOutputs["comment"]["infinite"]["items"][number] }) {
  return (
    <p className="my-0 max-w-[55ch] whitespace-pre-wrap font-sans text-color-neutral-700">
      {separateTextUrls(comment.text).map((x) => {
        if (x.type === "url") {
          if (x.str.startsWith(process.env.NEXT_PUBLIC_ABSURL)) {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            <Link key={comment.id} prefetch={false} href={x.str.split(process.env.NEXT_PUBLIC_ABSURL)[1] || "/"}>
              {x.str}
            </Link>;
          } else {
            return (
              <a key={comment.id} href={x.str}>
                {x.str}
              </a>
            );
          }
        } else {
          return <span key={comment.id}>{x.str}</span>;
        }
      })}
    </p>
  );
}

export function PinnedComment({
  user,
  //comment,
  commentId,
  eventCreatorId,
}: {
  user: TokenUser | null;
  //comment: RouterOutputs["comment"]["infinite"]["items"][number];
  commentId: bigint;
  eventCreatorId: bigint;
}) {
  const { data } = api.comment.getById.useQuery({ id: commentId });
  if (!data) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center">
        <IconPin className="h-5 w-5 text-color-neutral-700" />{" "}
        <span className="ml-1 text-xs text-color-neutral-700">pinned</span>
      </div>
      <Comment isPinned user={user} comment={data} eventCreatorId={eventCreatorId} />
    </div>
  );
}
