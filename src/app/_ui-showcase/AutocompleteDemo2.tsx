"use client";

import { IconCheck } from "#src/icons/Check";

import { cn } from "#src/utils/cn";
import { Command, CommandInput, CommandGroup, CommandItem, CommandList } from "#src/ui/command";
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

  return (
    <Command className="w-56">
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
        className=""
      />

      <div className="relative">
        <div className="absolute w-56">
          {open ? (
            <CommandList>
              <CommandGroup heading="Suggestions">
                {/*<CommandEmpty>No framework found.</CommandEmpty>*/}
                {frameworks
                  //.filter((x) => x.value !== search)
                  .map((framework) => (
                    <CommandItem
                      hidden={search === framework.value}
                      //className={search === framework.value ? "hidden" : ""}
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
                      <IconCheck
                        className={cn("mr-2 h-4 w-4", search === framework.value ? "opacity-100" : "opacity-0")}
                      />
                      {framework.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          ) : null}
        </div>
      </div>
    </Command>
  );
}
