"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Input } from "#src/ui/input";
import { useToast } from "#src/ui/use-toast";
import { schemaCreate } from "#src/trpc/routers/eventSchema";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof schemaCreate>;

export function Create() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schemaCreate),
    defaultValues: {
      title: "",
      date: new Date(),
    },
  });

  const { toast } = useToast();

  const eventCreate = api.event.create.useMutation({
    onSuccess: ({ hashid }) => {
      form.reset();
      router.push(`/event/${hashid}`);
    },
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Couldnt create event", description: "Try again" });
    },
  });

  function onValid(data: FormData) {
    eventCreate.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="text" placeholder="Whats happening?" {...field} />
              </FormControl>

              {/*<FormDescription>some description.</FormDescription>*/}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={eventCreate.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
