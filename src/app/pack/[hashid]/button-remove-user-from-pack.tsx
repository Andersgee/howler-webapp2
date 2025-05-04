"use client";

import { actionRevalidateTag } from "#src/app/actions";
import { api } from "#src/hooks/api";
import { IconClose } from "#src/icons/Close";
import { Button } from "#src/ui/button";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  packId: bigint;
  userId: bigint;
};

export function ButtonRemoveUserFromPack({ className, packId, userId }: Props) {
  const { mutate, isPending } = api.pack.removeUser.useMutation({
    onSuccess(data, _variables, _context) {
      void actionRevalidateTag(data.tag);
    },
  });
  return (
    <div className={cn("", className)}>
      <Button
        variant="warning"
        disabled={isPending}
        onClick={() => {
          mutate({ packId, userId });
        }}
      >
        <IconClose /> remove
      </Button>
    </div>
  );
}
