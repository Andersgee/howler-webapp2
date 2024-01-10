"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Input } from "#src/ui/input";
import { useToast } from "#src/ui/use-toast";

const FormSchema = z.object({
  text: z.string().min(1, {
    message: "text must be at least 1 character.",
  }),
});

export function CreatePostTest() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      text: "",
    },
  });

  const { toast } = useToast();

  const postCreate = api.post.createtest.useMutation({
    onSuccess: (insertResult) => {
      console.log("insertResult:", insertResult);

      form.reset();
    },
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Couldnt create post", description: "Try again" });
    },
  });

  function onValid(data: z.infer<typeof FormSchema>) {
    postCreate.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>some label</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Whats happening?" {...field} />
              </FormControl>
              <FormDescription>some description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={postCreate.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
