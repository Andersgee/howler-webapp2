"use client";

import { cn } from "#src/utils/cn";
import { useNotificationSettings } from "#src/hooks/useNotificationSettings";
import { Button } from "#src/ui/button";
import { useRef } from "react";
import { Input } from "#src/ui/input";

type Props = {
  className?: string;
};

export function WebPushTestComp({ className }: Props) {
  const {
    isSupported,
    serviceWorkerRegistration,
    pushSubscription,
    notificationPermission,
    requestNotificationPermission,
    pushSubscriptionSubscribe,
    pushSubscriptionUnSubscribe,
  } = useNotificationSettings();

  return (
    <div className={cn("", className)}>
      <div className="my-4">
        <div>isSupported: {JSON.stringify(isSupported)}</div>
        <div>serviceWorkerRegistration: {serviceWorkerRegistration ? "yep" : "nope"}</div>
        <div>notificationPermission: {notificationPermission}</div>
        <Button onClick={() => requestNotificationPermission()}>requestNotificationPermission</Button>
      </div>

      <div className="my-4">
        <div>pushSubscription: {pushSubscription ? "yep" : "nope"}</div>
        <Button onClick={() => pushSubscriptionSubscribe()}>pushSubscriptionSubscribe</Button>
        <Button onClick={() => pushSubscriptionUnSubscribe()}>pushSubscriptionUnSubscribe</Button>
      </div>

      <div className="my-4">
        <NotifyYourselfForm />
      </div>
    </div>
  );
}

function NotifyYourselfForm() {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!ref.current?.value) return;

        console.log(ref.current.value);
        ref.current.value = "";
      }}
    >
      <Input type="text" ref={ref} placeholder="your message..." />
      <Button>send yourself a message</Button>
    </form>
  );
}
