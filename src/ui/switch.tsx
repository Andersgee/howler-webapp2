"use client";

import { type ComponentPropsWithRef } from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "#src/utils/cn";

function Switch({ className, ref, ...props }: ComponentPropsWithRef<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-color-neutral-200 outline-none transition-colors focus-visible:focusring disabled:cursor-not-allowed disabled:opacity-50 data-state-checked:bg-color-primary-500 data-state-unchecked:bg-color-primary-100",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-color-primary-500 shadow-lg ring-0 transition-transform data-state-checked:translate-x-5 data-state-checked:bg-color-primary-800 data-state-unchecked:translate-x-0"
        )}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
