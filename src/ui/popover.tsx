"use client";

import { type ComponentPropsWithRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "#src/utils/cn";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ref,
  ...props
}: ComponentPropsWithRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-md border bg-color-neutral-50 text-color-neutral-950 shadow-md outline-none data-state-open:animate-in data-state-open:fade-in-0 data-state-open:zoom-in-95 data-state-closed:animate-out data-state-closed:fade-out-0 data-state-closed:zoom-out-95 data-side-left:slide-in-from-right-2 data-side-right:slide-in-from-left-2 data-side-bottom:slide-in-from-top-2 data-side-top:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
