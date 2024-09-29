"use client";

import { cn } from "#src/utils/cn";
import { useNotificationSettings } from "#src/hooks/useNotificationSettings";
import { Button } from "#src/ui/button";
import { useMemo, useRef } from "react";
import { Input } from "#src/ui/input";
import { api } from "#src/hooks/api";
import { base64urlFromUint8Array } from "#src/utils/jsone";

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
        <div>pushSubscription.endpoint: {pushSubscription?.endpoint}</div>
        <Button onClick={() => pushSubscriptionSubscribe()}>pushSubscriptionSubscribe</Button>
        <Button onClick={() => pushSubscriptionUnSubscribe()}>pushSubscriptionUnSubscribe</Button>
      </div>

      <div className="my-4">{pushSubscription && <FormNotifyYourself pushSubscription={pushSubscription} />}</div>
    </div>
  );
}

function FormNotifyYourself({ pushSubscription }: { pushSubscription: PushSubscription }) {
  const { mutate } = api.webpush.selftest.useMutation({
    onSuccess: (stuff) => {
      console.log("stuff:", stuff);
    },
  });
  const ref = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    if (!ref.current?.value) return;

    const auth = pushSubscription.getKey("auth");
    const p256dh = pushSubscription.getKey("p256dh");
    if (!auth || !p256dh) return;

    mutate({
      payload: ref.current.value,
      pushSubscription: {
        endpoint: pushSubscription.endpoint,
        auth_base64url: base64urlFromUint8Array(new Uint8Array(auth)),
        p256dh_base64url: base64urlFromUint8Array(new Uint8Array(p256dh)),
      },
    });
    ref.current.value = "";
  };
  return (
    <div>
      <Input type="text" ref={ref} placeholder="your message..." />
      <Button type="button" onClick={handleSubmit}>
        send yourself a message
      </Button>
    </div>
  );
}
