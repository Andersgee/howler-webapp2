"use client";

import * as React from "react";
import { IconTrash } from "#src/icons/Trash";
import { Button } from "#src/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "#src/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "#src/ui/dropdown-menu";

const labels = ["feature", "bug", "enhancement", "documentation", "design", "question", "maintenance"];

export function ComboboxDropdownMenu() {
  const [label, setLabel] = React.useState("feature");
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-between">
      <p className="mr-2 text-sm font-medium">
        <span className="mr-2 rounded-lg bg-color-accent-highlight-200 px-3 py-1 text-xs font-bold text-color-accent-highlight-900">
          {label}
        </span>
        <span className="text-color-neutral-700">Create a new project</span>
      </p>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="icon">more</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Assign to...</DropdownMenuItem>
            <DropdownMenuItem>Set due date...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Apply label</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput placeholder="Filter label..." autoFocus={true} />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {labels.map((label) => (
                        <CommandItem
                          key={label}
                          onSelect={(value) => {
                            setLabel(value);
                            setOpen(false);
                          }}
                        >
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-color-accent-danger-600">
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
