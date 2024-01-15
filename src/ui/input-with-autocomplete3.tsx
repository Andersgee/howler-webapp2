import { cn } from "#src/utils/cn";
import { Command } from "cmdk";
import { inputElementStyles } from "./input";
import { useState } from "react";

type Props = {
  className?: string;
  suggestions: { key: bigint; value: string; label: string }[];
  value: string;
  /**
   * called whenever search input changes in any way
   *
   * also key will be defined if change was triggered by selecting a suggestion
   */
  onChange: (search: string, key: bigint | undefined) => void;
};

export function InputWithAutocomplete3({ className, suggestions, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Command>
      <Command.Input
        placeholder="anything / anywhere..."
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
        className={cn(inputElementStyles, "mb-1 w-full focus:focusring", className)}
        value={value}
        //when typing in search field (not triggered when selecting an option)
        onValueChange={(search) => onChange(search, undefined)}
      />

      {true && (
        <Command.List
          className={cn(
            "max-h-72 overflow-x-hidden overflow-y-scroll border-b border-l border-r border-color-neutral-400"
            //open ? "visible" : "invisible"
          )}
        >
          <Command.Group
            //heading="Suggestions"
            className="bg-color-neutral-0 p-1 text-color-neutral-900 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-color-neutral-500"
          >
            {suggestions.map((x) => (
              <Command.Item
                className="cursor-pointer px-2 py-1.5 hover:bg-color-neutral-400 aria-selected:bg-color-neutral-200 "
                key={x.key}
                value={x.value}
                //when selecting an option with mouse/keyboard only
                onSelect={() => {
                  console.log("onSelect");
                  onChange(x.label, x.key);
                }}
                //onClick={() => {
                //  console.log("onClick");
                //}}
              >
                {x.label}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      )}
    </Command>
  );
}
