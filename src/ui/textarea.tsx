import { type RefObject } from "react";
import { cn } from "#src/utils/cn";

export type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const inputElementStyles =
  "w-full border-color-neutral-400 bg-color-neutral-0 text-color-neutral-1000 placeholder:text-color-neutral-500 disabled:bg-color-neutral-100 disabled:text-color-neutral-400 rounded-md border px-3 py-3 text-sm disabled:cursor-not-allowed outline-none";

export function TextArea({ className, ref, ...props }: Props & { ref?: RefObject<HTMLTextAreaElement> }) {
  return <textarea className={cn(inputElementStyles, "focus-visible:focusring", className)} ref={ref} {...props} />;
}
