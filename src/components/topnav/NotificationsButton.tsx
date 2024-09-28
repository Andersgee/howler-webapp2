"use client";

import { useStore } from "#src/store";
import { Popover, PopoverContent, PopoverTrigger } from "#src/ui/popover";
import { dialogDispatch } from "#src/store/slices/dialog";
import Link from "next/link";
import { type TokenUser } from "#src/utils/jwt/schema";
import { api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { IconSettings } from "#src/icons/Settings";
import { buttonVariants } from "#src/ui/button";
import { IconLoadingSpinner } from "#src/icons/special";
import { IconBellWithNumber } from "#src/icons/BellWithNumber";

type Props = {
  user: TokenUser;
};

export function NotificationsButton({ user: _user }: Props) {
  const dialogValue = useStore.use.dialogValue();

  const pushSubscription = useStore.use.pushSubscription();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.notification.infinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const onLastItemInView = () => {
    if (!isFetchingNextPage && hasNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <Popover
      open={dialogValue === "notifications"}
      onOpenChange={(open) => dialogDispatch({ type: open ? "show" : "hide", name: "notifications" })}
    >
      <PopoverTrigger className="rounded-md p-1.5 outline-none hover:bg-color-neutral-200 focus-visible:focusring">
        <IconBellWithNumber number={0} />
      </PopoverTrigger>
      <PopoverContent className="">
        <div className="">
          {pushSubscription === null ? (
            <Link
              onClick={() => dialogDispatch({ type: "hide", name: "notifications" })}
              href="/settings/notifications"
              className={buttonVariants({ variant: "primary", className: "ml-2" })}
            >
              Enable Notifications
              <IconSettings />
            </Link>
          ) : (
            <div className="flex items-center justify-between p-4">
              <div>Notifications</div>

              <Link
                onClick={() => dialogDispatch({ type: "hide", name: "notifications" })}
                href="/settings/notifications"
                className={buttonVariants({ variant: "icon", className: "ml-2" })}
              >
                <IconSettings />
              </Link>
            </div>
          )}
          <hr />

          <div className="max-h-popper-available-minus-a-bit overflow-y-auto">
            {data?.pages
              .flatMap((page) => page.items)
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
            <IntersectionObserverDiv onVisible={onLastItemInView} />
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
        </div>
      </PopoverContent>
    </Popover>
  );
}

function IntersectionObserverDiv({ onVisible }: { onVisible: () => void }) {
  const ref = useIntersectionObserverCallback(([entry]) => {
    const isVisible = !!entry?.isIntersecting;
    if (isVisible) {
      onVisible();
    }
  }, []);

  return <div ref={ref} className="min-h-[1px] min-w-[1px]"></div>;
}
