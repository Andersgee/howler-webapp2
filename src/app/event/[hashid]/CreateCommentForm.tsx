"use client";

import { api } from "#src/hooks/api";
//import { Input } from "#src/ui/input";
import { TextArea } from "#src/ui/textarea";
import { useToast } from "#src/ui/use-toast";
import { cn } from "#src/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Button } from "#src/ui/button";

const zFormData = z.object({
  text: z.string().min(3, { message: "at least 3 characters" }).max(280, { message: "at most 280 characters" }),
});

type FormData = z.infer<typeof zFormData>;

type Props = {
  className?: string;
  eventId: bigint;
};

export function CreateCommentForm({ className, eventId }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(zFormData),
    defaultValues: {
      text: "",
    },
  });

  const { toast } = useToast();
  const commentCreate = api.comment.create.useMutation({
    onSuccess: () => {
      form.reset();
      //router.push(`/event/${hashid}`);
    },
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Could not add comment", description: "Try again" });
    },
  });

  const onValid = (data: FormData) => {
    commentCreate.mutate({ ...data, eventId });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="space-y-2">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                {/*<FormLabel className="">Comment</FormLabel>*/}
                <FormControl>
                  <TextArea
                    rows={2}
                    placeholder="your comment"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="ml-8" />
              {/*<FormDescription>some string.</FormDescription>*/}
            </FormItem>
          )}
        />
        <Button variant="primary" type="submit" disabled={commentCreate.isPending}>
          Post
        </Button>
      </form>
    </Form>
  );
}
