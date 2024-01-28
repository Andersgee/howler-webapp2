"use client";

import { useStore } from "#src/store";

export function Payload() {
  const payload = useStore.use.fcmMessagePayload();
  return (
    <div>
      <pre>{JSON.stringify(payload, null, 2)}</pre>
    </div>
  );
}
