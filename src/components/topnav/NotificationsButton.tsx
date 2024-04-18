"use client";

import { useStore } from "#src/store";
import { Popover, PopoverContent, PopoverTrigger } from "#src/ui/popover";
import { dialogDispatch } from "#src/store/slices/dialog";
import Link from "next/link";
import { type TokenUser } from "#src/utils/jwt/schema";
//import { IconBell } from "#src/icons/Bell";
import { api } from "#src/hooks/api";
import { useIntersectionObserverCallback } from "#src/hooks/useIntersectionObserverCallback";
import { IconSettings } from "#src/icons/Settings";
import { buttonVariants } from "#src/ui/button";
import { IconLoadingSpinner } from "#src/icons/special";
import { useToast } from "#src/ui/use-toast";
import { useEffect, useState } from "react";
import { z } from "zod";
import { IconBellWithNumber } from "#src/icons/BellWithNumber";

/*
const TEST_NOTIFICATIONS: {
  id: bigint;
  title: string;
  body: string;
  relativeLink: string;
}[] = Array.from({ length: 30 }).map((_, i) => ({
  id: BigInt(i),
  title: i.toString().repeat(7),
  body: i.toString().repeat(23),
  relativeLink: "/",
}));
*/

export function NotificationsButton({ user: _user }: { user: TokenUser }) {
  //const user = useStore.use.user();
  const dialogValue = useStore.use.dialogValue();
  const fcmMessagePayload = useStore.use.fcmMessagePayload();
  const maybeRequestNotifications = useStore.use.maybeRequestNotifications();
  const utils = api.useUtils();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = api.notification.infinite.useInfiniteQuery(
    {},
    {
      //enabled: dialogValue === "notifications",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      //initialCursor: initialPosts.items.at(-1)?.id,
      //initialData: { pages: [initialPosts], pageParams: [] },
    }
  );

  const [unreadNumber, setUnreadNumber] = useState(0);

  useEffect(() => {
    if (!fcmMessagePayload) return;

    const safeParsed = z
      .object({
        notification: z.object({
          title: z.string(),
          body: z.string(),
        }),
        data: z.object({
          id: z.coerce.bigint(),
          relativeLink: z.string(),
        }),
      })
      .safeParse(fcmMessagePayload);
    if (safeParsed.success) {
      utils.notification.infinite.setInfiniteData({}, (oldData) => {
        if (!oldData) return oldData;

        //for dev / hot-reload / double effect call without duplication
        const existingItem = oldData.pages.at(0)?.items.find((x) => x.id === safeParsed.data.data.id);
        if (!existingItem) {
          const data = structuredClone(oldData);
          data.pages.at(0)?.items.unshift({
            id: safeParsed.data.data.id,
            title: safeParsed.data.notification.title,
            body: safeParsed.data.notification.body,
            relativeLink: safeParsed.data.data.relativeLink,
          });
          return data;
        } else {
          return oldData;
        }
      });
      setUnreadNumber((prev) => prev + 1);
    } else {
      console.log("NotificationButton, fcmMessagePayload not expected format");
    }
  }, [fcmMessagePayload, utils]);

  const onLastItemInView = () => {
    if (!isFetchingNextPage && hasNextPage) {
      void fetchNextPage();
    }
  };
  const { toast } = useToast();
  const onDenied = () =>
    toast({
      variant: "default",
      title: "You have blocked notifications",
      description:
        "Open your browser preferences or click the lock near the address bar to change your notification preferences.",
    });
  const onTriggerClick = () => {
    setUnreadNumber(0);
    void maybeRequestNotifications(onDenied);
  };

  return (
    <Popover
      open={dialogValue === "notifications"}
      onOpenChange={(open) => dialogDispatch({ type: open ? "show" : "hide", name: "notifications" })}
    >
      <PopoverTrigger
        className="rounded-md p-1.5 outline-none hover:bg-color-neutral-200 focus-visible:focusring"
        onClick={onTriggerClick}
      >
        <IconBellWithNumber number={unreadNumber} />
      </PopoverTrigger>
      <PopoverContent className="">
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

          <div className="max-h-popper-available-minus-a-bit overflow-y-auto">
            {/*
            {TEST_NOTIFICATIONS.map((notification) => (
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
            */}

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
