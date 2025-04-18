"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { useToast } from "#src/ui/use-toast";
import { cn } from "#src/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldErrors, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Button } from "#src/ui/button";
import { type TokenUser } from "#src/utils/jwt/schema";
import { dialogDispatch } from "#src/store/slices/dialog";
import { IconClose } from "#src/icons/Close";
import { IconCheck } from "#src/icons/Check";
import { Input } from "#src/ui/input";
import { IconWhat } from "#src/icons/What";

const zFormData = z.object({
  //id: z.bigint().optional(),
  title: z.string().min(3, { message: "at least 3 characters" }).max(280, { message: "at most 55 characters" }),
  //image: z.string().nullish(),
  //creatorId: z.bigint(),
});
// z.object({
//  text: z.string().min(3, { message: "at least 3 characters" }).max(280, { message: "at most 280 characters" }),
//});

type FormData = z.infer<typeof zFormData>;

type Props = {
  className?: string;
  //user: TokenUser | null;
};

export function FormCreatePack({ className }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(zFormData),
    defaultValues: {
      title: "",
      //text: reply.text,
    },
  });

  const { toast } = useToast();
  const utils = api.useUtils();
  const { mutate, isPending } = api.pack.create.useMutation({
    onSuccess: () => {
      void utils.pack.invalidate();
      form.reset();
      //router.push(`/event/${hashid}`);
      //await utils.reply.infinite.invalidate({ commentId: reply.commentId });
    },
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Could not edit reply", description: "Try again" });
    },
  });

  const onValid = (data: FormData) => {
    //console.log(data)
    mutate(data);
    //if (user) {
    //  replyUpdate.mutate({ ...data, commentId: reply.id });
    //} else {
    //  dialogDispatch({ type: "show", name: "profilebutton" });
    //}
  };

  const onInvalid = (x: FieldErrors<FormData>) => {
    console.log("onInvalid", x);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid, onInvalid)} className={cn("space-y-2", className)}>
        <div>Create Pack</div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <IconWhat />
                <FormLabel className="w-11 shrink-0">Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Your pack name"
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

        <div className="flex justify-end gap-2">
          {/* 
          <Button variant="outline" onClick={onStopEditing}>
            <IconClose className="mr-1" /> Cancel
          </Button>
           */}
          <Button variant="positive" type="submit" disabled={isPending}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
