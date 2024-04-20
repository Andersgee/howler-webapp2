"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "#src/hooks/api";
import { Button } from "#src/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Input } from "#src/ui/input";
import { useToast } from "#src/ui/use-toast";
import { useRouter } from "next/navigation";
import { datetimelocalString } from "#src/utils/date";
import { GoogleMaps } from "#src/components/GoogleMaps";
import { useStore } from "#src/store";
import { useEffect, useRef, useState } from "react";
import { InputWithAutocomplete } from "#src/ui/input-with-autocomplete";
import { IconWhat } from "#src/icons/What";
import { IconWhen } from "#src/icons/When";
import { IconWhere } from "#src/icons/Where";
//import { IconWho } from "#src/icons/Who";
import { dialogDispatch } from "#src/store/slices/dialog";
import { zGeoJsonPoint } from "#src/db/types-geojson";
import { ControlLocate } from "#src/components/GoogleMaps/control-locate";
import { getCurrentPosition } from "#src/utils/geolocation";
import { ControlUnpickPoint } from "#src/components/GoogleMaps/control-unpick-point";

const zFormData = z.object({
  title: z.string().trim().min(3, { message: "at least 3 characters" }).max(55, { message: "at most 55 characters" }),
  date: z.date(),
  location: zGeoJsonPoint.nullable(),
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

type FormData = z.infer<typeof zFormData>;

type Props = {
  isSignedIn: boolean;
};

export function CreateEventForm({ isSignedIn }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(zFormData),
    defaultValues: {
      title: "",
      date: new Date(),
      location: null,
      locationName: "",
    },
  });
  const [showMap, setShowMap] = useState(false);
  const googleMapsPickedPoint = useStore.use.googleMapsPickedPoint();
  //const googleMapsPickedPoint = useStore((s) => s.googleMapsPickedPoint);
  const { data: pickedPointNames } = api.geocode.fromPoint.useQuery(
    { point: googleMapsPickedPoint! },
    {
      enabled: isSignedIn && Boolean(googleMapsPickedPoint),
    }
  );

  useEffect(() => {
    //auto fill locationName if empty when picking a point
    const ln = form.getValues("locationName");
    if (!ln && pickedPointNames?.[0]) {
      form.setValue("locationName", pickedPointNames[0]);
    }
  }, [pickedPointNames, form]);

  useEffect(() => {
    if (googleMapsPickedPoint) {
      form.setValue("location", googleMapsPickedPoint);
    }
  }, [googleMapsPickedPoint, form]);

  const router = useRouter();

  const { toast } = useToast();

  const eventCreate = api.event.create.useMutation({
    onSuccess: ({ hashid }) => {
      form.reset();
      router.push(`/event/${hashid}`);
    },
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Could not create event", description: "Try again" });
    },
  });

  const onValid = (data: FormData) => {
    if (!isSignedIn) {
      dialogDispatch({ type: "show", name: "profilebutton" });
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
                {/*
                <IconWhere />
                <FormLabel className="w-11 shrink-0">Where</FormLabel>
                */}
                <Button
                  type="button"
                  variant="icon"
                  className="m-0 py-2 pl-0 pr-2"
                  onClick={() => setShowMap((prev) => !prev)}
                >
                  <IconWhere />
                  <div className="w-11 shrink-0">Where</div>
                </Button>
                {/*<FormDescription>click on map (optional)</FormDescription>*/}
                <FormControl>
                  <InputWithAutocomplete
                    aria-label="Where"
                    placeholder="Location name..."
                    suggestions={pickedPointNames?.map((p) => ({ label: p, value: p.toLowerCase() })) ?? []}
                    {...field}
                  />
                </FormControl>
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

        <div className="flex gap-2 py-4">
          {isSignedIn ? (
            <Button variant="positive" type="submit" disabled={eventCreate.isPending}>
              Create
            </Button>
          ) : (
            <>
              <Button variant="positive" onClick={() => dialogDispatch({ type: "show", name: "profilebutton" })}>
                Create
              </Button>
              <p className="text-color-neutral-600">sign in to create events</p>
            </>
          )}
        </div>
      </form>
    </Form>
  );
}

function Map({ show }: { show: boolean }) {
  const didRun = useRef(false);
  const didRun2 = useRef(false);
  const googleMaps = useStore.use.googleMaps();
  useEffect(() => {
    //initialize mode (once)
    if (!googleMaps || didRun.current) return;
    googleMaps.setMode("pick-location");
    didRun.current = true;
  }, [googleMaps]);

  useEffect(() => {
    //auto place marker on location (once, and only if granted)
    if (!googleMaps || !show || didRun2.current) return;
    getCurrentPosition((res) => {
      if (res.ok) {
        googleMaps.map.setOptions({ center: res.latLng, zoom: 15 });
        googleMaps.setPickedPointAndMarker(res.latLng);
      }
    });
    didRun2.current = true;
  }, [googleMaps, show]);

  return show ? (
    <div className="h-96 w-full">
      <GoogleMaps />
      <ControlUnpickPoint />
      <ControlLocate
        onLocated={(latLng) => {
          if (googleMaps) {
            googleMaps.map.setOptions({ center: latLng, zoom: 15 });
            googleMaps.setPickedPointAndMarker(latLng);
          }
        }}
      />
    </div>
  ) : null;
}
