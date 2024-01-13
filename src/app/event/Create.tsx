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
import { useEffect, useState } from "react";
import { InputWithAutocomplete } from "#src/ui/input-with-autocomplete";
import { IconWhat, IconWhen, IconWhere, IconWho } from "#src/icons";

type FormData = z.infer<typeof schemaCreate>;

export function Create() {
  const [showMap, setShowMap] = useState(false);
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
      locationName: "",
      location: undefined,
      who: "",
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

  useEffect(() => {
    if (googleMapsPickedPoint) {
      console.log({ googleMapsPickedPoint });
      form.setValue("location", googleMapsPickedPoint);
    }
  }, [googleMapsPickedPoint, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => eventCreate.mutate(data))} className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <IconWhat />
                <FormLabel className="w-11 shrink-0">What</FormLabel>
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
          name="locationName"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <IconWhere />
                <FormLabel className="w-11 shrink-0">Where</FormLabel>
                {/*<FormDescription>click on map (optional)</FormDescription>*/}
                <FormControl>
                  <InputWithAutocomplete
                    placeholder="anywhere"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    suggestions={pickedPointNames?.map((p) => ({ label: p, value: p.toLocaleLowerCase() })) ?? []}
                    {...field}
                  />
                </FormControl>
                <Button variant="outline" onClick={() => setShowMap((prev) => !prev)}>
                  {showMap ? "close map" : "show map"}
                </Button>
              </div>
              <FormMessage className="ml-8" />
              {/*<FormDescription>some string.</FormDescription>*/}
            </FormItem>
          )}
        />
        {showMap && (
          <div className="h-96 w-full">
            <GoogleMaps />
          </div>
        )}

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <IconWhen />
                <FormLabel className="w-11 shrink-0">When</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={datetimelocalString(field.value!)}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      form.setValue("date", new Date(e.target.value));
                    }}
                    className="w-auto"
                  />
                </FormControl>
              </div>
              <FormMessage className="ml-8" />
              {/*<FormDescription>some date.</FormDescription>*/}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="who"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <IconWho />
                <FormLabel className="w-11 shrink-0">Who</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="anyone"
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

        <Button type="submit" disabled={eventCreate.isPending}>
          Howl
        </Button>
      </form>
    </Form>
  );
}
