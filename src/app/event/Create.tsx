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
import { datetimelocalString } from "#src/utils/date";
import { GoogleMaps } from "#src/components/GoogleMaps";
import { useStore } from "#src/store";
import { useEffect } from "react";

type FormData = z.infer<typeof schemaCreate>;

export function Create() {
  const googleMapsPickedPoint = useStore.use.googleMapsPickedPoint();
  const { data: pickedPointNames } = api.geocode.fromPoint.useQuery(
    { point: googleMapsPickedPoint! },
    {
      enabled: !!googleMapsPickedPoint,
    }
  );

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

  useEffect(() => {
    if (googleMapsPickedPoint) {
      console.log({ googleMapsPickedPoint });
      form.setValue("location", googleMapsPickedPoint);
    }
  }, [googleMapsPickedPoint, form]);

  useEffect(() => {
    if (pickedPointNames && pickedPointNames.length > 0) {
      console.log({ pickedPointName: pickedPointNames });
      form.setValue("locationName", pickedPointNames[0]);
    }
  }, [pickedPointNames, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="text" placeholder="Whats happening?" {...field} />
              </FormControl>
              {/*<FormDescription>some string.</FormDescription>*/}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>When</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  type="datetime-local"
                  value={datetimelocalString(field.value!)}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    form.setValue("date", new Date(e.target.value));
                  }}
                />
              </FormControl>
              {/*<FormDescription>some date.</FormDescription>*/}
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Where</FormLabel>
          <FormMessage />
          <FormControl>
            <Input type="text" placeholder="Location name" {...form.register("locationName")} />
          </FormControl>
          {/*<FormDescription>{pickedPointName}</FormDescription>*/}
          <div className="h-52 w-full">
            <GoogleMaps />
          </div>
        </FormItem>
        {/*
        <FormField
          control={form.control}
          name="locationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Where</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="text" placeholder="Location name" {...field} />
              </FormControl>
              <FormDescription>{pickedPointName}</FormDescription>
              <div className="h-52 w-full">
                <GoogleMaps />
              </div>
            </FormItem>
          )}
        />
        */}

        <Button type="submit" disabled={eventCreate.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
