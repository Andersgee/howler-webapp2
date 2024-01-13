"use client";

import { Check, ChevronsUpDown } from "#src/icons";
import { Button } from "#src/ui/button";
import { cn } from "#src/utils/cn";
import { Popover, PopoverTrigger, PopoverContent } from "#src/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "#src/ui/command";
import { useState } from "react";
//import { CommandList } from "cmdk";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "next2.js",
    label: "Next2.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function AutoCompleteDemo2() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");

  return (
    <Command>
      <CommandInput
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        value={search}
        onValueChange={(x) => {
          //console.log(x);
          setSearch(x);
          //setOpen(true);
        }}
        placeholder="Location name..."
      />
      <CommandList>
        <CommandGroup heading="Suggestions">
          {/*<CommandEmpty>No framework found.</CommandEmpty>*/}

          {frameworks
            //.filter((x) => x.value !== search)
            .map((framework) => (
              <CommandItem
                hidden={search === framework.value}
                className={search === framework.value ? "hidden" : ""}
                key={framework.value}
                value={framework.value}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  //setSearch(val);
                }}
                onSelect={(val) => {
                  console.log(val);
                  //setValue(currentValue === value ? "" : currentValue);
                  setSearch(val);
                  //setOpen(false);
                }}
              >
                {framework.label}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
