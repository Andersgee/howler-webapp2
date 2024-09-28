"use client";

import { useNotificationSettings } from "#src/hooks/useNotificationSettings";
import { Button, buttonVariants } from "#src/ui/button";
import { cn } from "#src/utils/cn";
import { useEffect, useState } from "react";
import Link from "next/link";
import { type RouterOutputs, api } from "#src/hooks/api";
import { IconCheck } from "#src/icons/Check";
import { IconClose } from "#src/icons/Close";

type Props = {
  className?: string;
  mYPushSubscriptions: RouterOutputs["webpush"]["myPushSubscriptions"];
};

export function NotificationnSettings({ className, mYPushSubscriptions }: Props) {
  const {
    isSupported,
    isStandalone,
    notificationPermission,
    pushSubscription,
    pushSubscriptionSubscribe,
    pushSubscriptionSubscribeLoading,
    pushSubscriptionUnSubscribe,
    pushSubscriptionUnSubscribeLoading,
  } = useNotificationSettings();

  const { data } = api.webpush.myPushSubscriptions.useQuery(undefined, {
    initialData: mYPushSubscriptions,
  });

  if (isStandalone === undefined || isSupported === undefined || pushSubscription === undefined) return null;

  if (isSupported === false) {
    return NotSupported();
  }

  if (notificationPermission === "denied") {
    return <Denied />;
  }
  return (
    <div className={cn("", className)}>
      <div className="mt-4 grid grid-cols-2 items-center  gap-4">
        <h3>app</h3>
        <div>
          {isStandalone ? (
            <IconCheck className="h-8 w-8 text-color-accent-positive-800" />
          ) : (
            <Link href="/install" className={buttonVariants({ variant: "primary" })}>
              Install
            </Link>
          )}
        </div>
        <hr className="col-span-2" />
        <h3>push notifications</h3>
        {pushSubscription ? (
          <Button disabled={pushSubscriptionSubscribeLoading} onClick={pushSubscriptionUnSubscribe} variant="warning">
            disable
          </Button>
        ) : (
          <Button disabled={pushSubscriptionUnSubscribeLoading} onClick={pushSubscriptionSubscribe} variant="positive">
            enable
          </Button>
        )}
        <hr className="col-span-2" />

        <div className="col-span-2 flex">
          {data.some(({ endpoint }) => endpoint === pushSubscription?.endpoint) ? (
            <span className="flex items-center">
              You are good to go
              <IconCheck className="h-8 w-8 text-color-accent-positive-800" />
            </span>
          ) : (
            <span className="flex items-center">
              This device will not get notifications
              <IconClose className="h-8 w-8 text-color-accent-danger-700" />
            </span>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
}

function NotSupported() {
  const [userAgent, setUserAgent] = useState("");
  useEffect(() => {
    setUserAgent(navigator.userAgent);
  }, []);

  return (
    <div>
      <h1>Not supported</h1>
      <p>This browser does not support push notifications</p>
      <p>For reference, this is the user agent: {userAgent}</p>
    </div>
  );
}

function Denied() {
  return (
    <div>
      <h1>You have blocked notifications for this app</h1>
      <p>Go into your browser settings and allow notification permission</p>
    </div>
  );
}
