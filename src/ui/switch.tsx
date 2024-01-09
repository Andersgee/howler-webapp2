"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "#src/utils/cn";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "data-state-checked:bg-color-primary-500 data-state-unchecked:bg-color-primary-100 peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-color-neutral-200 outline-none transition-colors focus-visible:focusring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "data-state-checked:translate-x-5 data-state-unchecked:translate-x-0 data-state-checked:bg-color-primary-800 pointer-events-none block h-5 w-5 rounded-full bg-color-primary-700 shadow-lg ring-0 transition-transform"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
