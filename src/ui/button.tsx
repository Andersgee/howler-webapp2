import { type ComponentPropsWithRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "flex h-11 items-center justify-center rounded-md text-sm font-bold outline-none transition-colors focus-visible:focusring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-color-primary-200 px-4 py-2 text-color-primary-900 hover:bg-color-primary-300 hover:text-color-primary-950 disabled:text-color-primary-800",
        danger:
          "bg-color-accent-danger-100 px-4 py-2 text-color-accent-danger-900 hover:bg-color-accent-danger-200 hover:text-color-accent-danger-950 disabled:text-color-accent-danger-800",
        warning:
          "bg-color-accent-warning-100 px-4 py-2 text-color-accent-warning-900 hover:bg-color-accent-warning-200 hover:text-color-accent-warning-950 disabled:text-color-accent-warning-800",
        positive:
          "bg-color-accent-positive-200 px-4 py-2 text-color-accent-positive-900 hover:bg-color-accent-positive-300 hover:text-color-accent-positive-950 disabled:text-color-accent-positive-800",
        outline:
          "border border-color-neutral-300 bg-color-neutral-50 p-[10px] text-color-neutral-900 hover:bg-color-neutral-200 hover:text-color-neutral-1000 disabled:text-color-neutral-800",
        icon: "bg-color-neutral-100 p-[10px] text-color-neutral-900 hover:bg-color-neutral-200 hover:text-color-neutral-1000",
        trigger:
          "border border-color-neutral-300 bg-color-neutral-0 p-[10px] text-color-neutral-900 hover:bg-color-neutral-200 hover:text-color-neutral-1000 disabled:text-color-neutral-800",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export function Button({
  className,
  type = "button",
  variant,
  ref,
  ...props
}: ComponentPropsWithRef<"button"> & VariantProps<typeof buttonVariants>) {
  return <button type={type} className={buttonVariants({ variant, className })} ref={ref} {...props} />;
}
