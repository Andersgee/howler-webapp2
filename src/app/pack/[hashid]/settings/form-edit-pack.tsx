"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type RouterOutputs, api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Input } from "#src/ui/input";
import { useToast } from "#src/ui/use-toast";
import { cn } from "#src/utils/cn";
import { z } from "zod";
import { actionRevalidateTag } from "#src/app/actions";
import { RadioGroup, RadioGroupItem } from "#src/ui/radio-group";

const zFormData = z.object({
  id: z.bigint(),
  title: z.string().optional(),
  image: z.string().nullish(),
  //imageAspect: z.number().optional(),
  //imageBlurData: zTypedArray.nullish(),
  //createdAt: z.date().optional(),
  inviteSetting: z.enum(["PUBLIC", "MEMBERS_AND_ABOVE", "ADMINS_AND_ABOVE", "CREATOR_ONLY"]),
});

type FormData = z.input<typeof zFormData>;

type Props = {
  className?: string;
  initialPack: NonNullable<RouterOutputs["pack"]["getById"]>;
};

export function FormEditPack({ className, initialPack }: Props) {
  //const actionUpdateWithInfo = actionOnSuccess.bind(null, initialEvent.id.toString());

  const form = useForm<FormData>({
    resolver: zodResolver(zFormData),
    defaultValues: {
      id: initialPack.id,
      title: initialPack.title,
      image: initialPack.image,
      inviteSetting: initialPack.inviteSetting,
    },
  });

  const { toast } = useToast();

  const { mutate, isPending } = api.pack.update.useMutation({
    onSuccess(data, variables, context) {
      toast({ variant: "default", title: "Settings saved" });
      void actionRevalidateTag(data.tag);
    },
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Could not update pack", description: "Try again" });
    },
  });

  const onValid = (data: FormData) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className={cn("space-y-4", className)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="">
                <FormLabel className="font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="anything"
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

        <FormField
          control={form.control}
          name="inviteSetting"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-semibold">Choose how your pack can grow</FormLabel>

              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {Object.entries(INVITE_SETTING_OPTIONS).map(([value, label]) => (
                    <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={value} />
                      </FormControl>
                      <FormLabel className="font-normal">{label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>

              <p className="text-balance text-xs">
                Note: All options except first will requires a user to either be invited or request to join and then be
                approved.
              </p>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Save
        </Button>
      </form>
    </Form>
  );
}

const INVITE_SETTING_OPTIONS: Record<FormData["inviteSetting"], string> = {
  PUBLIC: "Open for anyone to join if they want.",
  MEMBERS_AND_ABOVE: "Any member can grow the pack.",
  ADMINS_AND_ABOVE: "Only admins can grow the pack.",
  CREATOR_ONLY: "Only original pack creator can grow the pack.",
};
