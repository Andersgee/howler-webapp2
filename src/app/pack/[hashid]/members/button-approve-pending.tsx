"use client";

import { actionRevalidateTag } from "#src/app/actions";
import { api } from "#src/hooks/api";
import { IconCheck } from "#src/icons/Check";
import { Button } from "#src/ui/button";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  packId: bigint;
  userId: bigint;
};

export function ButtonApproveMembershipRequest({ className, packId, userId }: Props) {
  const { mutate, isPending } = api.pack.approveMembershipRequest.useMutation({
    onSuccess(data, _variables, _context) {
      void actionRevalidateTag(data.tag);
    },
  });
  return (
    <div className={cn("", className)}>
      <Button
        variant="positive"
        disabled={isPending}
        onClick={() => {
          mutate({ packId, userId });
        }}
      >
        <IconCheck /> approve
      </Button>
    </div>
  );
}
