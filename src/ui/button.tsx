import { forwardRef } from "react";
//import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "flex h-11 items-center justify-center rounded-md text-sm font-bold outline-none transition-colors focus-visible:focusring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-color-primary-200 px-4 py-2 text-color-primary-900 hover:bg-color-primary-300 hover:text-color-primary-950",
        danger:
          "bg-color-accent-danger-100 px-4 py-2 text-color-accent-danger-900 hover:bg-color-accent-danger-200 hover:text-color-accent-danger-950",
        warning:
          "bg-color-accent-warning-100 px-4 py-2 text-color-accent-warning-900 hover:bg-color-accent-warning-200 hover:text-color-accent-warning-950",
        positive:
          "bg-color-accent-positive-200 px-4 py-2 text-color-accent-positive-900 hover:bg-color-accent-positive-300 hover:text-color-accent-positive-950",
        outline:
          "border border-color-neutral-300 bg-color-neutral-50 p-[10px] text-color-neutral-900 hover:bg-color-neutral-200 hover:text-color-neutral-1000",
        icon: "bg-color-neutral-100 p-[10px] text-color-neutral-900 hover:bg-color-neutral-200 hover:text-color-neutral-1000",
        trigger:
          "border border-color-neutral-300 bg-color-neutral-0 p-[10px] text-color-neutral-900 hover:bg-color-neutral-200 hover:text-color-neutral-1000",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

/*
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={buttonVariants({ variant, className })} ref={ref} {...props} />;
});
*/

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, ...props }, ref) => {
  return <button className={buttonVariants({ variant, className })} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
