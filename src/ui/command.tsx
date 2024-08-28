"use client";

import { type ComponentPropsWithRef } from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "#src/utils/cn";
import { Dialog, DialogContent } from "#src/ui/dialog";
import { inputElementStyles } from "./input";

export const CommandLoading = CommandPrimitive.Loading;

function Command({ className, ref, ...props }: ComponentPropsWithRef<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      ref={ref}
      className={cn(
        "flex h-full w-full flex-col rounded-md bg-color-neutral-50 text-color-neutral-900",
        //"overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-color-neutral-600 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

function CommandInput({ className, ref, ...props }: ComponentPropsWithRef<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center" cmdk-input-wrapper="">
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          //"flex h-10 w-full rounded-md border border-color-neutral-400 bg-color-neutral-0 px-3 py-6 text-sm text-color-neutral-1000 outline-none placeholder:text-color-neutral-500 disabled:cursor-not-allowed disabled:bg-color-neutral-200 disabled:text-color-neutral-400",
          inputElementStyles,
          //"outline-none focus-visible:focusring",
          //"border-4 border-color-accent-highlight-600",
          "mb-1 focus:focusring",
          className
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ref, ...props }: ComponentPropsWithRef<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn(
        "max-h-72 overflow-x-hidden overflow-y-scroll",
        "border-b border-l border-r border-color-neutral-400",
        //"overflow-y-auto overflow-x-hidden",
        className
      )}
      {...props}
    />
  );
}

function CommandEmpty({ className, ref, ...props }: ComponentPropsWithRef<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty ref={ref} className={cn("select-none py-6 text-center text-sm", className)} {...props} />
  );
}

function CommandGroup({ className, ref, ...props }: ComponentPropsWithRef<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        "bg-color-neutral-0 p-1 text-color-neutral-900 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-color-neutral-500",
        //"overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

function CommandSeparator({ className, ref, ...props }: ComponentPropsWithRef<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-color-neutral-500", className)} {...props} />
  );
}

function CommandItem({ className, ref, ...props }: ComponentPropsWithRef<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        //"aria-selected:nothover:focusring cursor-pointer hover:bg-color-neutral-200",
        "flex cursor-pointer items-center px-2 py-1.5 aria-selected:bg-color-neutral-200",
        //"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:text-color-neutral-500",
        //"aria-selected:bg-color-neutral-200",
        className
      )}
      {...props}
    />
  );
}

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest text-color-neutral-900", className)} {...props} />;
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
