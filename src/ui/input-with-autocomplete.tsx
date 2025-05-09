import { IconCheck } from "#src/icons/Check";
import { cn } from "#src/utils/cn";
import { Command, CommandInput, CommandGroup, CommandItem, CommandList } from "#src/ui/command";
import { useState } from "react";

type Props = React.ComponentPropsWithRef<typeof CommandInput> & {
  suggestions: { label: string; value: string }[];
  onChange?: (value: string) => void;
};

function InputWithAutocomplete({
  suggestions,
  className,
  onBlur,
  onFocus,
  onChange,
  autoCapitalize = "none",
  autoComplete = "off",
  autoCorrect = "off",
  ref,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <Command className="w-56">
      <CommandInput
        ref={ref}
        onBlur={(e) => {
          setOpen(false);
          onBlur?.(e);
        }}
        onFocus={(e) => {
          setOpen(true);
          onFocus?.(e);
        }}
        value={search}
        onValueChange={(x) => {
          setSearch(x);
          onChange?.(x);
        }}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        className={className}
        {...props}
      />

      <div className="relative">
        <div className="absolute z-50 w-56">
          {open && suggestions.length > 0 ? (
            <CommandList>
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.value}
                    value={suggestion.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={(val) => {
                      setSearch(val);
                      onChange?.(val);
                    }}
                  >
                    <IconCheck
                      className={cn("mr-2 h-4 w-4", search === suggestion.value ? "opacity-100" : "opacity-0")}
                    />
                    {suggestion.label}
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

export { InputWithAutocomplete };
