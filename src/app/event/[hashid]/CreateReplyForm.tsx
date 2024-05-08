"use client";

import { api } from "#src/hooks/api";
//import { Input } from "#src/ui/input";
import { TextArea } from "#src/ui/textarea";
import { useToast } from "#src/ui/use-toast";
import { cn } from "#src/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "#src/ui/form";
import { Button } from "#src/ui/button";
import { type TokenUser } from "#src/utils/jwt/schema";
import { dialogDispatch } from "#src/store/slices/dialog";
import { IconSend } from "#src/icons/Send";

const zFormData = z.object({
  text: z.string().min(3, { message: "at least 3 characters" }).max(280, { message: "at most 280 characters" }),
});

type FormData = z.infer<typeof zFormData>;

type Props = {
  className?: string;
  user: TokenUser | null;
  eventId: bigint;
  commentId: bigint;
};

export function CreateReplyForm({ className, user, eventId, commentId }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(zFormData),
    defaultValues: {
      text: "",
    },
  });

  const { toast } = useToast();
  const utils = api.useUtils();
  const replyCreate = api.reply.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await utils.reply.infinite.invalidate({ commentId }); //update replies

      //update replyCount on comment,
      utils.comment.infinite.setInfiniteData({ eventId }, (oldData) => {
        if (!oldData) return oldData;

        const data = structuredClone(oldData);
        for (const page of data.pages) {
          for (const item of page.items) {
            if (item.id === commentId) {
              item.replyCount += 1;
            }
          }
        }
        return data;
      });
    },
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Could not add comment", description: "Try again" });
    },
  });

  const onValid = (data: FormData) => {
    if (user) {
      replyCreate.mutate({ ...data, commentId });
    } else {
      dialogDispatch({ type: "show", name: "profilebutton" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className={cn("space-y-2", className)}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              {/*<FormLabel className="">Comment</FormLabel>*/}
              <FormControl>
                <TextArea
                  className="resize-y"
                  rows={2}
                  placeholder="Your reply..."
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  {...field}
                />
              </FormControl>
              {/*<FormDescription>some string.</FormDescription>*/}
              <FormMessage className="ml-8" />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button variant="primary" type="submit" disabled={replyCreate.isPending}>
            <IconSend className="mr-1" /> Add reply
          </Button>
        </div>
      </form>
    </Form>
  );
}
