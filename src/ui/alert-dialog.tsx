"use client";

import { type ComponentPropsWithRef } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "#src/utils/cn";
import { buttonVariants } from "#src/ui/button";
import { type VariantProps } from "class-variance-authority";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

function AlertDialogOverlay({ className, ref, ...props }: ComponentPropsWithRef<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-color-neutral-0/80 backdrop-blur-sm data-state-open:animate-in data-state-open:fade-in-0 data-state-closed:animate-out data-state-closed:fade-out-0",
        className
      )}
      {...props}
      ref={ref}
    />
  );
}

function AlertDialogContent({ className, ref, ...props }: ComponentPropsWithRef<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-color-neutral-200 bg-color-neutral-0 p-6 shadow-lg duration-200 data-state-open:animate-in data-state-open:fade-in-0 data-state-open:zoom-in-95 data-state-open:slide-in-from-left-1/2 data-state-open:slide-in-from-top-[48%] data-state-closed:animate-out data-state-closed:fade-out-0 data-state-closed:zoom-out-95 data-state-closed:slide-out-to-left-1/2 data-state-closed:slide-out-to-top-[48%] sm:rounded-lg md:w-full",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
}

function AlertDialogTitle({ className, ref, ...props }: ComponentPropsWithRef<typeof AlertDialogPrimitive.Title>) {
  return <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />;
}

function AlertDialogDescription({
  className,
  ref,
  ...props
}: ComponentPropsWithRef<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-color-neutral-700", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  variant,
  ref,
  ...props
}: ComponentPropsWithRef<typeof AlertDialogPrimitive.Action> & VariantProps<typeof buttonVariants>) {
  return <AlertDialogPrimitive.Action ref={ref} className={buttonVariants({ variant, className })} {...props} />;
}

function AlertDialogCancel({ className, ref, ...props }: ComponentPropsWithRef<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
