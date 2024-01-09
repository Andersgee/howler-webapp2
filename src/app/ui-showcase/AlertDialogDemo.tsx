"use client";

import { ButtonWithConfirmDialog } from "#src/ui/button-with-confirm";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
};

export function AlertDialogDemo({ className }: Props) {
  return (
    <div className={cn("", className)}>
      <ButtonWithConfirmDialog
        variant="primary"
        //className="hover:bg-red-800"
        title="Are you absolutely sure?"
        description="This action cannot be undone."
        cancelLabel="Cancel"
        actionLabel="Delete my account"
        actionVariant="danger"
        onActionClick={() => console.log("confirmed")}
      >
        Delete account
      </ButtonWithConfirmDialog>
    </div>
  );
}
