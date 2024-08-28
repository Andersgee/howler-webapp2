"use client";

import { type ComponentPropsWithRef } from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "#src/utils/cn";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ref,
  ...props
}: ComponentPropsWithRef<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-md border border-color-neutral-200 bg-color-neutral-0 p-4 text-color-neutral-950 shadow-md outline-none data-state-open:animate-in data-state-open:fade-in-0 data-state-open:zoom-in-95 data-state-closed:animate-out data-state-closed:fade-out-0 data-state-closed:zoom-out-95 data-side-left:slide-in-from-right-2 data-side-right:slide-in-from-left-2 data-side-bottom:slide-in-from-top-2 data-side-top:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
