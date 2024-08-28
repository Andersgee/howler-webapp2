"use client";

import { type ComponentPropsWithRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "#src/utils/cn";

export function Label({ className, ref, ...props }: ComponentPropsWithRef<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}
