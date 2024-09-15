"use client";

import { atomCount } from "#src/store/jotai/atoms/atom-count";
import { cn } from "#src/utils/cn";
import { useAtom } from "jotai";
import { decrCount } from "./hmm";
import { useNotificationSettings } from "#src/hooks/useNotificationSettings";
import { Button } from "#src/ui/button";

type Props = {
  className?: string;
};

export function Stuff({ className }: Props) {
  const {
    isSupported,
    pushSubscription,
    notificationPermission,
    requestNotificationPermission,
    pushSubscriptionSubscribe,
    pushSubscriptionUnSubscribe,
  } = useNotificationSettings();
  const [count, setCount] = useAtom(atomCount);
  return (
    <div className={cn("", className)}>
      <div className="my-4">
        <div>isSupported: {JSON.stringify(isSupported)}</div>
        <div>notificationPermission: {notificationPermission}</div>
        <Button onClick={() => requestNotificationPermission()}>requestNotificationPermission</Button>
      </div>

      <div className="my-4">
        <div>pushSubscription: {pushSubscription ? "yep" : "nope"}</div>
        <Button onClick={() => pushSubscriptionSubscribe()}>pushSubscriptionSubscribe</Button>
        <Button onClick={() => pushSubscriptionUnSubscribe()}>pushSubscriptionUnSubscribe</Button>
      </div>
      <div>count: {count}</div>
      <button
        className="block"
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        incr
      </button>
      <button
        className="block"
        onClick={() => {
          decrCount();
        }}
      >
        decr from outside react
      </button>
    </div>
  );
}
