"use client";

import { Payload } from "#src/components/Payload";
import { cn } from "#src/utils/cn";
import { JSONE } from "#src/utils/jsone";

type Props = {
  className?: string;
  eventId: bigint;
};

export function Stuff({ className, eventId }: Props) {
  return (
    <div className={cn("", className)}>
      <button className="block bg-red-500 p-2" onClick={() => void sendping(eventId)}>
        sendping
      </button>
      <Payload />
    </div>
  );
}

async function sendping(id: bigint) {
  //const body = z.object({ id: z.bigint() }).parse(JSONE.parse(await request.text()));
  const res = await fetch("/api/message/eventcreated", {
    method: "POST",
    body: JSONE.stringify({ id }),
  });
  console.log("res:", res);
}
