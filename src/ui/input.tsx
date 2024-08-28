import { type ComponentPropsWithRef } from "react";
import { cn } from "#src/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const inputElementStyles =
  "w-56 border-color-neutral-400 bg-color-neutral-0 text-color-neutral-1000 placeholder:text-color-neutral-500 disabled:bg-color-neutral-100 disabled:text-color-neutral-400 flex h-10 rounded-md border px-3 py-6 text-sm  disabled:cursor-not-allowed outline-none";

export function Input({ className, type, ref, ...props }: ComponentPropsWithRef<"input">) {
  return (
    <input type={type} className={cn(inputElementStyles, "focus-visible:focusring", className)} ref={ref} {...props} />
  );
}
