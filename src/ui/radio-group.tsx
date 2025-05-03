"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { type ComponentPropsWithRef } from "react";
import { cn } from "#src/utils/cn";
import { IconCircle } from "#src/icons/Circle";

export function RadioGroup({ className, ref, ...props }: ComponentPropsWithRef<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
}

export function RadioGroupItem({ className, ref, ...props }: ComponentPropsWithRef<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "ring-offset-background focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border border-color-neutral-600 text-color-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <IconCircle className="text-current h-2.5 w-2.5 fill-color-primary-600" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
