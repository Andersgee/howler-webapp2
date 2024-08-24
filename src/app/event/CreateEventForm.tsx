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

import { IconWhat } from "#src/icons/What";
import { IconWhen } from "#src/icons/When";
import { IconWhere } from "#src/icons/Where";
//import { IconWho } from "#src/icons/Who";
import { dialogDispatch } from "#src/store/slices/dialog";
import { zGeoJsonPoint } from "#src/db/types-geojson";
import { ControlLocate } from "#src/components/GoogleMaps/control-locate";
import { ControlUnpickPoint } from "#src/components/GoogleMaps/control-unpick-point";
import { ControlFullscreen } from "#src/components/GoogleMaps/control-fullscreen";
import { IconChevronDown } from "#src/icons/ChevronDown";
import { cn } from "#src/utils/cn";
import { InputAutocompleteGooglePlaces } from "#src/components/InputAutocompleteGooglePlaces";
import { pointFromlatLngLiteral } from "#src/components/GoogleMaps/google-maps-point-latlng";

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

function usePlaceFromPlaceId(placeId: string | null) {
  const googleMaps = useStore.use.googleMaps();
  const { data: place } = api.geocode.fromPlaceId.useQuery({ placeId: placeId! }, { enabled: !!placeId });

  //pan google maps to the point also if its open
  useEffect(() => {
    if (place && googleMaps) {
      googleMaps.map.panTo(place.geometry.location);
      googleMaps.setPickedPointAndMarker(place.geometry.location);
    }
  }, [place, googleMaps]);

  return place;
}

export function CreateEventForm({ isSignedIn }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(zFormData),
    defaultValues: {
      title: "",
      date: new Date(Date.now() + 1000 * 60 * 60),
      location: null,
      locationName: "",
    },
  });
  const [showMap, setShowMap] = useState(false);

  //set location whenever this changes
  const googleMapsPickedPoint = useStore.use.googleMapsPickedPoint();
  useEffect(() => {
    form.setValue("location", googleMapsPickedPoint); //always set this (on unpick also)
  }, [form, googleMapsPickedPoint]);

  //set both location and locationName whenever this changes
  const [clickedSuggestionPlaceId, setClickedSuggestionPlaceId] = useState<string | null>(null);
  const selectedPlace = usePlaceFromPlaceId(clickedSuggestionPlaceId);
  useEffect(() => {
    if (selectedPlace) {
      form.setValue("locationName", selectedPlace.formatted_address);
      form.setValue("location", pointFromlatLngLiteral(selectedPlace.geometry.location));
    }
  }, [form, selectedPlace]);

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
                <IconWhere />
                <FormLabel className="w-11 shrink-0">Where</FormLabel>
                <InputAutocompleteGooglePlaces
                  value={field.value}
                  onChange={(str, placeId) => {
                    field.onChange(str);
                    if (placeId) {
                      setClickedSuggestionPlaceId(placeId);
                      console.log("selected placeId", placeId);
                    }
                  }}
                />
                <Button onClick={() => setShowMap((prev) => !prev)} variant="icon">
                  <IconChevronDown className={cn("transition-transform duration-200", showMap && "rotate-180")} />
                </Button>
              </div>
              <FormMessage className="ml-8" />
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
  //const didRun2 = useRef(false);
  const googleMaps = useStore.use.googleMaps();

  useEffect(() => {
    //initialize mode (once)
    if (!googleMaps || didRun.current) return;
    googleMaps.setMode("pick-location");
    didRun.current = true;
  }, [googleMaps]);

  return show ? (
    <div className="h-96 w-full">
      <GoogleMaps />
      <ControlFullscreen />
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
