"use client";

import { useStore } from "#src/store";
import { Popover, PopoverContent, PopoverTrigger } from "#src/ui/popover";
import { dialogDispatch } from "#src/store/slices/dialog";
import Link from "next/link";
import { type TokenUser } from "#src/utils/jwt/schema";
import { IconBell } from "#src/icons/Bell";
import { api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { IconSettings } from "#src/icons/Settings";
import { buttonVariants } from "#src/ui/button";
import { IconLoadingSpinner } from "#src/icons/special";

export function NotificationsButton({ user }: { user: TokenUser }) {
  //const user = useStore.use.user();
  const dialogValue = useStore.use.dialogValue();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.notification.infinite.useInfiniteQuery(
    {},
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
      console.log("isVisible:", isVisible);
      if (isVisible && !isFetchingNextPage && hasNextPage) {
        console.log("running fetchNextPage");
        void fetchNextPage();
      }
    },
    [isFetchingNextPage, hasNextPage]
  );

  return (
    <Popover
      open={dialogValue === "notifications"}
      onOpenChange={(open) => dialogDispatch({ type: open ? "show" : "hide", name: "notifications" })}
    >
      <PopoverTrigger className="rounded-md p-1.5 outline-none hover:bg-color-neutral-200 focus-visible:focusring">
        <IconBell />
      </PopoverTrigger>
      <PopoverContent>
        <div className="">
          <div className="flex items-center justify-between p-4">
            <div>Notifications</div>
            <Link
              onClick={() => dialogDispatch({ type: "hide", name: "notifications" })}
              href="/profile"
              className={buttonVariants({ variant: "icon", className: "ml-2" })}
            >
              <IconSettings />
            </Link>
          </div>
          <hr />
          {data?.pages
            .map((page) => page.items)
            .flat()
            .map((notification) => (
              <Link
                key={notification.id}
                onClick={() => dialogDispatch({ type: "hide", name: "notifications" })}
                prefetch={false}
                className="block p-2 hover:bg-color-neutral-200"
                href={notification.relativeLink}
              >
                <div>
                  <div>{notification.title}</div>
                  <p>{notification.body}</p>
                </div>
                <hr />
              </Link>
            ))}
          <div ref={ref} className="flex min-h-[1px] justify-center p-2">
            {hasNextPage ? isFetchingNextPage ? <IconLoadingSpinner /> : "has more but not fetching" : "end of list"}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
