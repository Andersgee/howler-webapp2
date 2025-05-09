import { IconChevronDown } from "#src/icons/ChevronDown";
import { IconClose } from "#src/icons/Close";
import { Button, buttonVariants } from "#src/ui/button";
import { cn } from "#src/utils/cn";
import { Command } from "cmdk";
import { useState } from "react";
import { Trigger as CollapsibleTrigger } from "@radix-ui/react-collapsible";

type Props = {
  placeholder?: string;
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

export function InputSearch({
  className,
  suggestions,
  value,
  onChange,
  placeholder = "anything / anywhere...",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Command
      className="w-72 text-base text-color-neutral-1000"
      shouldFilter={false} //Im filtering (and sorting) at db level with fulltext query
    >
      <div className="relative">
        <Command.Input
          placeholder={placeholder}
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
            className="absolute right-14 top-3"
            variant="icon"
            aria-label="clear"
            onClick={() => onChange("", undefined)}
          >
            <IconClose />
          </Button>
        )}
        <CollapsibleTrigger
          className={buttonVariants({
            variant: "icon",
            className: "group absolute right-1 top-3",
          })}
          aria-label="advanced-search"
        >
          <IconChevronDown className="transition-transform duration-200 group-data-state-open:rotate-180" />
        </CollapsibleTrigger>
      </div>
      {open && (
        <Command.List className="m-0 max-h-72 overflow-x-hidden overflow-y-scroll rounded-b-lg bg-color-neutral-0">
          {suggestions.map((x) => (
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
              {x.label}
            </Command.Item>
          ))}
        </Command.List>
      )}
    </Command>
  );
}
