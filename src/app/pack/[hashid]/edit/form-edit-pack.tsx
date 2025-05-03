"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type RouterOutputs, api } from "#src/hooks/api";
import { Button, buttonVariants } from "#src/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "#src/ui/form";
import { Input } from "#src/ui/input";
import { useToast } from "#src/ui/use-toast";
import { datetimelocalString } from "#src/utils/date";
import { GoogleMaps } from "#src/components/GoogleMaps";
import { useStore } from "#src/store";
import { useEffect, useRef, useState } from "react";
import { IconWhat } from "#src/icons/What";
import { IconWhen } from "#src/icons/When";
import { IconWhere } from "#src/icons/Where";
//import { IconWho } from "#src/icons/Who";
import { cn } from "#src/utils/cn";
import { ControlUnpickPoint } from "#src/components/GoogleMaps/control-unpick-point";
import { z } from "zod";
import { zGeoJsonPoint, type GeoJson } from "#src/db/types-geojson";
//import { actionOnSuccess } from "./actions";
import { setGoogleMapsPickedPoint } from "#src/store/slices/map";
import { latLngLiteralFromPoint, pointFromlatLngLiteral } from "#src/components/GoogleMaps/google-maps-point-latlng";
import { actionRevalidateTagAndRedirect } from "#src/app/actions";
import Link from "next/link";
import { hashidFromId } from "#src/utils/hashid";
import { ControlLocate } from "#src/components/GoogleMaps/control-locate";
import { InputAutocompleteGooglePlaces } from "#src/components/InputAutocompleteGooglePlaces";
import { IconChevronDown } from "#src/icons/ChevronDown";
import { usePlaceFromPlaceId } from "#src/hooks/usePlaceFromPlaceId";
import { ControlFullscreen } from "#src/components/GoogleMaps/control-fullscreen";
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

const INVITE_SETTING_OPTIONS: Record<FormData["inviteSetting"], string> = {
  PUBLIC: "Open for anyone to join if they want.",
  MEMBERS_AND_ABOVE: "Any member can grow the pack.",
  ADMINS_AND_ABOVE: "Only admins can grow the pack.",
  CREATOR_ONLY: "Only original pack creator can grow the pack.",
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
    },
    //onSuccess: () => {
    //  //void actionRevalidateTagAndRedirect(tag, `/event/${hashid}`);
    //},
    onError: (_error, _variables, _context) => {
      toast({ variant: "warn", title: "Could not update pack", description: "Try again" });
    },
  });

  const onValid = (data: FormData) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValid)} className={cn("space-y-2", className)}>
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

              <div className="text-sm">
                <p>Note: All options except first will requires a user to either.</p>
                <ol className="list-inside list-disc">
                  <li>be invited</li>
                  <li>request to join and then be approved by a member</li>
                </ol>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-2"></div>
        <Button type="submit" disabled={isPending}>
          Save
        </Button>
      </form>
    </Form>
  );
}
