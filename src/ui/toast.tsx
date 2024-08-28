import { type ComponentPropsWithRef } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#src/utils/cn";
import { IconClose } from "#src/icons/Close";
import { buttonVariants } from "./button";

const ToastProvider = ToastPrimitives.Provider;

function ToastViewport({ className, ref, ...props }: ComponentPropsWithRef<typeof ToastPrimitives.Viewport>) {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className
      )}
      {...props}
    />
  );
}

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border  p-6 pr-8 shadow-lg transition-all data-swipe-cancel:translate-x-0 data-swipe-end:translate-x-[var(--radix-toast-swipe-end-x)] data-swipe-move:translate-x-[var(--radix-toast-swipe-move-x)] data-swipe-move:transition-none data-state-open:animate-in data-state-closed:animate-out data-swipe-end:animate-out data-state-closed:fade-out-80  data-state-closed:slide-out-to-right-full data-state-open:slide-in-from-top-full data-state-open:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-color-neutral-50 bg-color-neutral-800 text-color-neutral-50",
        warn: "warn group border-color-accent-danger-50 bg-color-accent-danger-200 text-color-accent-danger-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Toast({
  className,
  variant,
  ref,
  ...props
}: ComponentPropsWithRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>) {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
}
function ToastAction({ className, ref, ...props }: ComponentPropsWithRef<typeof ToastPrimitives.Action>) {
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn("shrink-0", buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
}

function ToastClose({ className, ref, ...props }: ComponentPropsWithRef<typeof ToastPrimitives.Close>) {
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-color-neutral-200 opacity-0 transition-opacity hover:text-color-neutral-0 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.warn]:text-color-accent-danger-50 group-[.warn]:hover:text-color-accent-danger-50 group-[.warn]:focus:ring-color-accent-danger-400 group-[.warn]:focus:ring-offset-color-accent-danger-600",
        className
      )}
      toast-close=""
      {...props}
    >
      <IconClose className="h-4 w-4" />
    </ToastPrimitives.Close>
  );
}

function ToastTitle({ className, ref, ...props }: ComponentPropsWithRef<typeof ToastPrimitives.Title>) {
  return <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />;
}

function ToastDescription({ className, ref, ...props }: ComponentPropsWithRef<typeof ToastPrimitives.Description>) {
  return <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />;
}

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
