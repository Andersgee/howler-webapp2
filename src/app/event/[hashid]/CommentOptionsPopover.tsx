import { actionRevalidateTag } from "#src/app/actions";
import { type RouterOutputs, api } from "#src/hooks/api";
import { IconEdit } from "#src/icons/Edit";
import { IconMoreVertical } from "#src/icons/MoreVertical";
import { IconPin } from "#src/icons/Pin";
import { IconPinOff } from "#src/icons/PinOff";
import { IconReply } from "#src/icons/Reply";
import { IconTrash } from "#src/icons/Trash";
import { tagsEvent } from "#src/trpc/routers/eventTags";
import { Button } from "#src/ui/button";
import { ButtonWithConfirmDialog } from "#src/ui/button-with-confirm";

import { Popover, PopoverContent, PopoverTrigger } from "#src/ui/popover";
import { type TokenUser } from "#src/utils/jwt/schema";

import { useState } from "react";

type Props = {
  user: TokenUser | null;
  comment: RouterOutputs["comment"]["infinite"]["items"][number];
  eventCreatorId: bigint;
  onEditClick: () => void;
  onShowRepliesClick: () => void;
  isPinned: boolean;
};

export function CommentOptionsPopover({
  user,
  onEditClick,
  onShowRepliesClick,
  comment,
  eventCreatorId,
  isPinned,
}: Props) {
  const utils = api.useUtils();
  const commentDelete = api.comment.delete.useMutation({
    onSuccess: async () => {
      await utils.comment.infinite.invalidate({ eventId: comment.eventId });
      if (isPinned) {
        await actionRevalidateTag(tagsEvent.info(comment.eventId));
      }
    },
  });

  const eventPinComment = api.event.updatePinnedComment.useMutation({
    onSuccess: async ({ tag }) => {
      await utils.comment.infinite.invalidate({ eventId: comment.eventId });
      await actionRevalidateTag(tag);
    },
  });

  //const commentUpdate = api.comment.update.useMutation({
  //  onSuccess: () => utils.comment.infinite.invalidate({ eventId: comment.eventId }),
  //});

  const [open, setOpen] = useState(false);

  if (comment.userId !== user?.id) {
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
        {user.id === eventCreatorId ? (
          <Button
            variant="icon"
            className=""
            onClick={() => {
              setOpen(false);
              eventPinComment.mutate({
                id: comment.eventId,
                pinnedCommentId: isPinned ? null : comment.id,
              });
            }}
          >
            {isPinned ? (
              <>
                <IconPinOff /> Unpin
              </>
            ) : (
              <>
                <IconPin /> Pin to top
              </>
            )}
          </Button>
        ) : null}
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

        <Button
          variant="icon"
          className=""
          onClick={() => {
            setOpen(false);
            onShowRepliesClick();
          }}
        >
          <IconReply /> Reply
        </Button>
        <ButtonWithConfirmDialog
          className=""
          variant="icon"
          title="Are you sure?"
          description="Delete this comment. This can not be undone."
          disabled={commentDelete.isPending}
          actionLabel="Delete"
          actionVariant="danger"
          cancelLabel="Cancel"
          onActionClick={() => {
            setOpen(false);
            commentDelete.mutate({ commentId: comment.id });
          }}
        >
          <IconTrash /> Delete
        </ButtonWithConfirmDialog>
      </PopoverContent>
    </Popover>
  );
}
