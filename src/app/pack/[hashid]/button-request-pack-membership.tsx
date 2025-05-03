"use client";

import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  packId: bigint;
};

export function ButtonRequestPackMembership({ className, packId }: Props) {
  const { mutate, isPending } = api.pack.removeUser.useMutation({
    onSuccess(data, variables, context) {
      console.log(data);
    },
  });
  return (
    <div className={cn("", className)}>
      <Button
        variant="warning"
        //disabled={isPending}
        onClick={() => {
          //mutate({ packId, userId });
        }}
      >
        Ask to join
      </Button>
    </div>
  );
}
