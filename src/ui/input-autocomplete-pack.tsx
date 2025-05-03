"use client";

import { useState } from "react";
import { IconClose } from "#src/icons/Close";
import { Button } from "#src/ui/button";
import { cn } from "#src/utils/cn";
import { Command } from "cmdk";
import { api } from "#src/hooks/api";

type Props = {
  className?: string;
  value: string;
  /**
   * called whenever search input changes in any way
   *
   * also packId will be defined if change was triggered by selecting a suggestion
   */
  onChange: (value: string, packId: bigint | undefined | null) => void;
};

export function InputAutocompletePack({ className, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const { data: suggestions } = api.pack.listMy.useQuery();

  return (
    <Command
      className="w-56 text-base text-color-neutral-1000"
      shouldFilter={false} //handle filtering (and sorting) myself
    >
      <div className="relative">
        <Command.Input
          placeholder="anyone"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") {
              setOpen(false);
            } else {
              setOpen(true);
            }
          }}
          className={cn(
            "flex w-full border-none bg-color-neutral-0 px-3 py-5 outline-none placeholder:text-color-neutral-500",
            open ? "rounded-t-lg" : "rounded-lg",
            className
          )}
          value={value}
          //when typing in search field (not triggered when selecting an option)
          onValueChange={(search) => onChange(search, undefined)}
        />
        {value.length > 0 && (
          <Button
            className="absolute right-1 top-3"
            variant="icon"
            aria-label="clear"
            onClick={() => onChange("", null)}
          >
            <IconClose />
          </Button>
        )}
      </div>

      {open && (
        <Command.List className="absolute z-50 m-0 max-h-72 w-72 overflow-x-hidden overflow-y-scroll rounded-b-lg bg-color-neutral-0">
          {suggestions
            ?.map((x) => ({
              value: x.id.toString(),
              key: x.id,
              label: x.title,
              secondaryLabel: `${x.memberCount} members`,
            }))
            .map((x) => (
              <Command.Item
                className="cursor-pointer px-2 py-1.5 hover:bg-color-neutral-400 aria-selected:nothover:bg-color-neutral-200"
                key={x.key}
                value={x.value}
                //when selecting an option with mouse/keyboard only
                onSelect={() => {
                  onChange(x.label, x.key);
                  setOpen(false);
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <span>{x.label}</span>
                <span className="ml-1 text-color-neutral-500">{x.secondaryLabel}</span>
              </Command.Item>
            ))}
        </Command.List>
      )}
    </Command>
  );
}
