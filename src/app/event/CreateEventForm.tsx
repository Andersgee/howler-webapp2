"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Input } from "#src/ui/input";
import { useToast } from "#src/ui/use-toast";
import { schemaCreate } from "#src/trpc/routers/eventSchema";
import { useRouter } from "next/navigation";
import { datetimelocalString } from "#src/utils/date";
import { GoogleMaps } from "#src/components/GoogleMaps";
import { useStore } from "#src/store";
import { useEffect, useRef, useState } from "react";
import { InputWithAutocomplete } from "#src/ui/input-with-autocomplete";
import { IconWhat } from "#src/icons/What";
import { IconWhen } from "#src/icons/When";
import { IconWhere } from "#src/icons/Where";
import { IconWho } from "#src/icons/Who";

type FormData = z.infer<typeof schemaCreate>;

type Props = {
  isSignedIn: boolean;
};

export function CreateEventForm({ isSignedIn }: Props) {
  const [showMap, setShowMap] = useState(false);
  const dialogAction = useStore.use.dialogAction();
  const googleMapsPickedPoint = useStore.use.googleMapsPickedPoint();
  const { data: pickedPointNames } = api.geocode.fromPoint.useQuery(
    { point: googleMapsPickedPoint! },
    {
      enabled: isSignedIn && Boolean(googleMapsPickedPoint),
      notifyOnChangeProps: ["data"],
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
    onError: (error, variables, context) => {
      console.log({ error, variables, context });
      toast({ variant: "warn", title: "Could not create event", description: "Try again" });
    },
  });

  useEffect(() => {
    if (googleMapsPickedPoint) {
      console.log({ googleMapsPickedPoint });
      form.setValue("location", googleMapsPickedPoint);
    }
  }, [googleMapsPickedPoint, form]);

  const onValid = (data: FormData) => {
    if (!isSignedIn) {
      dialogAction({ type: "show", name: "profilebutton" });
    } else {
      eventCreate.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className="space-y-2">
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
                    placeholder="Location name..."
                    suggestions={pickedPointNames?.map((p) => ({ label: p, value: p.toLowerCase() })) ?? []}
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
        <Map show={showMap} />

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

        {isSignedIn ? (
          <Button type="submit" disabled={eventCreate.isPending}>
            Howl
          </Button>
        ) : (
          <div>
            <p>(must sign in to create events)</p>
            <Button onClick={() => dialogAction({ type: "show", name: "profilebutton" })}>Sign in</Button>
          </div>
        )}
      </form>
    </Form>
  );
}

function Map({ show }: { show: boolean }) {
  const didRun = useRef(false);
  const googleMaps = useStore.use.googleMaps();
  useEffect(() => {
    if (!googleMaps || didRun.current) return;
    googleMaps.setMode("pick-location");
    didRun.current = true;
  }, [googleMaps]);

  return show ? (
    <div className="h-96 w-full">
      <GoogleMaps />
    </div>
  ) : null;
}
