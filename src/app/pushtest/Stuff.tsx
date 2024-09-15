"use client";

import { serviceWorkerGetExistingPushSubscription, serviceWorkerGetRegistration } from "#src/lib/service-worker";
import { cn } from "#src/utils/cn";
import { requestNotificationPermission } from "#src/utils/notification-permission";
import { useEffect, useState } from "react";

type Props = {
  className?: string;
};

async function stuff() {
  const r = await serviceWorkerGetRegistration();
  if (!r) return null;
  const existingSubscription = await serviceWorkerGetExistingPushSubscription(r);
  return existingSubscription;
}

export function Stuff({ className }: Props) {
  const [] = useState(false);
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);

  const a = useState(false);
  useEffect(() => {
    void stuff().then(setPushSubscription);
  }, []);

  return (
    <div className={cn("", className)}>
      <div>pushSubscription?.endpoint: {pushSubscription?.endpoint}</div>
      <div></div>
    </div>
  );
}
