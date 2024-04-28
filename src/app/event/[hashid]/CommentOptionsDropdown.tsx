import { type RouterOutputs, api } from "#src/hooks/api";
import { IconEdit } from "#src/icons/Edit";
import { IconMoreHorizontal } from "#src/icons/MoreHorizontal";
import { IconPin } from "#src/icons/Pin";
import { IconTrash } from "#src/icons/Trash";
import { Button } from "#src/ui/button";
import { ButtonWithConfirmDialog } from "#src/ui/button-with-confirm";

import { Popover, PopoverContent, PopoverTrigger } from "#src/ui/popover";

type Props = {
  comment: RouterOutputs["comment"]["infinite"]["items"][number];
};

export function CommentOptionsDropdown({ comment }: Props) {
  const utils = api.useUtils();
  const commentDelete = api.comment.delete.useMutation({
    onSuccess: () => utils.comment.infinite.invalidate({ eventId: comment.eventId }),
  });

  //const commentUpdate = api.comment.update.useMutation({
  //  onSuccess: () => utils.comment.infinite.invalidate({ eventId: comment.eventId }),
  //});

  return (
    <Popover
    //open={dialogValue === "notifications"}
    //onOpenChange={(open) => dialogDispatch({ type: open ? "show" : "hide", name: "notifications" })}
    >
      <PopoverTrigger
        className="rounded-md p-1.5 outline-none hover:bg-color-neutral-200 focus-visible:focusring"
        //onClick={onTriggerClick}
      >
        <IconMoreHorizontal />
      </PopoverTrigger>
      <PopoverContent>
        {/*
        <Button variant="icon" className="">
          <IconPin /> Pin to top
        </Button>
        <Button variant="icon" className="">
          <IconEdit /> Edit
        </Button>
        */}
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
            commentDelete.mutate({ commentId: comment.id });
          }}
        >
          <IconTrash /> Delete
        </ButtonWithConfirmDialog>
      </PopoverContent>
    </Popover>
  );
}
