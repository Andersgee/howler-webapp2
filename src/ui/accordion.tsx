"use client";

import { type ComponentPropsWithRef } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "#src/utils/cn";
import { IconChevronDown } from "#src/icons/ChevronDown";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({ className, ref, ...props }: ComponentPropsWithRef<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />;
}

function AccordionTrigger({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "group flex flex-1 items-center justify-between  px-4 py-3 font-medium outline-none transition-all hover:bg-color-neutral-100 focus-visible:focusring",
          className
        )}
        {...props}
      >
        {children}
        <IconChevronDown className="transition-transform duration-200 group-data-state-open:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all data-state-open:animate-accordion-down data-state-closed:animate-accordion-up",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
