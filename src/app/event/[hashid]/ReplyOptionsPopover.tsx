import { type RouterOutputs, api } from "#src/hooks/api";
import { IconEdit } from "#src/icons/Edit";
import { IconMoreVertical } from "#src/icons/MoreVertical";
import { IconTrash } from "#src/icons/Trash";
import { Button } from "#src/ui/button";
import { ButtonWithConfirmDialog } from "#src/ui/button-with-confirm";

import { Popover, PopoverContent, PopoverTrigger } from "#src/ui/popover";
import { type TokenUser } from "#src/utils/jwt/schema";

import { useState } from "react";

type Props = {
  user: TokenUser | null;
  reply: RouterOutputs["reply"]["infinite"]["items"][number];
  onEditClick: () => void;
};

export function ReplyOptionsPopover({ user, onEditClick, reply }: Props) {
  const utils = api.useUtils();
  const replyDelete = api.reply.delete.useMutation({
    onSuccess: async () => {
      //todo: perhaps optimistically update the comments reply count here
      await utils.reply.infinite.invalidate({ commentId: reply.commentId });
    },
  });

  //const commentUpdate = api.comment.update.useMutation({
  //  onSuccess: () => utils.comment.infinite.invalidate({ eventId: comment.eventId }),
  //});

  const [open, setOpen] = useState(false);

  if (reply.userId !== user?.id) {
    return null;
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      //onOpenChange={(open) => dialogDispatch({ type: open ? "show" : "hide", name: "notifications" })}
    >
      <PopoverTrigger
        className="rounded-md p-1.5 outline-none hover:bg-color-neutral-200 focus-visible:focusring"
        //onClick={onTriggerClick}
      >
        <IconMoreVertical />
      </PopoverTrigger>
      <PopoverContent>
        <Button
          variant="icon"
          className=""
          onClick={() => {
            setOpen(false);
            onEditClick();
          }}
        >
          <IconEdit /> Edit
        </Button>
        <ButtonWithConfirmDialog
          className=""
          variant="icon"
          title="Are you sure?"
          description="Delete this reply. This can not be undone."
          disabled={replyDelete.isPending}
          actionLabel="Delete"
          actionVariant="danger"
          cancelLabel="Cancel"
          onActionClick={() => {
            setOpen(false);
            replyDelete.mutate({ replyId: reply.id });
          }}
        >
          <IconTrash /> Delete
        </ButtonWithConfirmDialog>
      </PopoverContent>
    </Popover>
  );
}
