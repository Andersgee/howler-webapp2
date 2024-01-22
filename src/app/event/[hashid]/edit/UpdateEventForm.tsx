"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type RouterOutputs, api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Input } from "#src/ui/input";
import { useToast } from "#src/ui/use-toast";
import { datetimelocalString } from "#src/utils/date";
import { GoogleMaps } from "#src/components/GoogleMaps";
import { useStore } from "#src/store";
import { useEffect, useRef, useState } from "react";
import { InputWithAutocomplete } from "#src/ui/input-with-autocomplete";
import { IconWhat } from "#src/icons/What";
import { IconWhen } from "#src/icons/When";
import { IconWhere } from "#src/icons/Where";
//import { IconWho } from "#src/icons/Who";
import { cn } from "#src/utils/cn";
import { ControlUnpickPoint } from "#src/components/GoogleMaps/control-unpick-point";
import { z } from "zod";
import { zGeoJsonPoint, type GeoJSON } from "#src/db/geojson-types";
import { actionOnSuccess } from "./actions";
import { setGoogleMapsPickedPoint } from "#src/store/slices/map";

const zFormData = z.object({
  id: z.bigint(),
  title: z.string().trim().min(3, { message: "at least 3 characters" }).max(55, { message: "at most 55 characters" }),
  date: z.date(),
  location: zGeoJsonPoint.nullish(),
  locationName: z.union([
    z.string().trim().length(0, { message: "at least 3 characters - or empty" }),
    z
      .string()
      .trim()
      .min(3, { message: "at least 3 characters - or empty" })
      .max(55, { message: "at most 55 characters - or empty" }),
  ]),
  //image: z.string().nullish(),
  //imageAspect: z.number().optional(),
});

type FormData = z.input<typeof zFormData>;

type Props = {
  className?: string;
  initialEvent: RouterOutputs["event"]["getById"];
};

export function UpdateEventForm({ className, initialEvent }: Props) {
  //const actionUpdateWithInfo = actionOnSuccess.bind(null, initialEvent.id.toString());

  const form = useForm<FormData>({
    resolver: zodResolver(zFormData),
    defaultValues: {
      id: initialEvent.id,
      title: initialEvent.title,
      date: initialEvent.date,
      location: initialEvent.location,
      locationName: initialEvent.locationName ?? "",
    },
  });
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (initialEvent.location) {
      setGoogleMapsPickedPoint(initialEvent.location);
    }
  }, [initialEvent]);
  const googleMapsPickedPoint = useStore.use.googleMapsPickedPoint();

  const { data: pickedPointNames } = api.geocode.fromPoint.useQuery(
    { point: googleMapsPickedPoint! },
    {
      enabled: !!googleMapsPickedPoint,
    }
  );

  //const router = useRouter();

  const { toast } = useToast();

  const eventUpdate = api.event.update.useMutation({
    onSuccess: ({ hashid }) => {
      //form.reset();
      //router.push(`/event/${hashid}`); //revalidating in route handler does not bust router cache
      void actionOnSuccess(initialEvent.id.toString()); //so revalidate in server action, and might aswell redirect there aswell
    },
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Could not update event", description: "Try again" });
    },
  });

  useEffect(() => {
    form.setValue("location", googleMapsPickedPoint);
  }, [googleMapsPickedPoint, form]);

  const onValid = (data: FormData) => {
    eventUpdate.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className={cn("space-y-2", className)}>
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
        <Map show={showMap} initialLocation={initialEvent.location} />

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
                    value={datetimelocalString(field.value)}
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

        <Button type="submit" disabled={eventUpdate.isPending}>
          Save
        </Button>
      </form>
    </Form>
  );
}

function Map({ show, initialLocation }: { show: boolean; initialLocation: null | GeoJSON["Point"] }) {
  const didRun = useRef(false);
  const googleMaps = useStore.use.googleMaps();
  useEffect(() => {
    if (!googleMaps || didRun.current) return;

    googleMaps.setMode("pick-location");
    if (initialLocation) {
      const latLng = { lat: initialLocation.coordinates[0], lng: initialLocation.coordinates[1] };
      googleMaps.primaryMarker.position = latLng;
      googleMaps.map.setOptions({
        center: latLng,
        heading: 0,
        zoom: 11,
      });
    }
    didRun.current = true;
  }, [googleMaps, initialLocation]);

  return show ? (
    <>
      <div className="h-96 w-full">
        <GoogleMaps />
        <ControlUnpickPoint />
      </div>
    </>
  ) : null;
}
