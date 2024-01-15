import { cn } from "#src/utils/cn";
import { Command } from "cmdk";
import { inputElementStyles } from "./input";
import { useCallback, useMemo, useState } from "react";

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

  const list = useMemo(() => {
    return open ? suggestions : [];
  }, [suggestions, open]);

  return (
    <Command className="w-72 text-base text-color-neutral-1000">
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
        className={cn(
          "flex w-full border-none bg-color-neutral-0 px-3 py-6 outline-none placeholder:text-color-neutral-500",
          open ? "rounded-t-lg" : "rounded-lg",
          className
        )}
        value={value}
        //when typing in search field (not triggered when selecting an option)
        onValueChange={(search) => onChange(search, undefined)}
      />
      <Command.List
        className={cn(
          "m-0 max-h-72 overflow-x-hidden overflow-y-scroll rounded-b-lg bg-color-neutral-0"
          //open ? "opacity-100" : "opacity-0"
        )}
      >
        {list.map((x) => (
          <Command.Item
            className="cursor-pointer px-2 py-1.5 hover:bg-color-neutral-400 aria-selected:bg-color-neutral-200"
            key={x.key}
            value={x.value}
            //when selecting an option with mouse/keyboard only
            onSelect={() => {
              console.log("onSelect");
              onChange(x.label, x.key);
              setOpen(false);
            }}
            //onClick={() => {
            //  console.log("onClick");
            //}}
          >
            {x.label}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
}
