"use client";

import { actionRevalidateTag } from "#src/app/actions";
import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  packId: bigint;
};

export function ButtonJoinPack({ className, packId }: Props) {
  const { mutate, isPending } = api.pack.requestMembership.useMutation({
    onSuccess(data, variables, context) {
      void actionRevalidateTag(data.tag);
    },
  });

  return (
    <div className={cn("", className)}>
      <Button variant="primary" disabled={isPending} onClick={() => mutate({ packId })}>
        join
      </Button>
    </div>
  );
}

export function ButtonRequestPackMembership({ className, packId }: Props) {
  const { mutate, isPending } = api.pack.requestMembership.useMutation({
    onSuccess(data, variables, context) {
      void actionRevalidateTag(data.tag);
    },
  });

  return (
    <div className={cn("", className)}>
      <Button variant="primary" disabled={isPending} onClick={() => mutate({ packId })}>
        Ask to join
      </Button>
      <p>The pack will be notified and someone will let you in</p>
    </div>
  );
}
