import { Check } from "#src/icons";
import { cn } from "#src/utils/cn";
import { Command, CommandInput, CommandGroup, CommandItem, CommandList } from "#src/ui/command";
import { type ChangeEventHandler, forwardRef, useState } from "react";

type Props = {
  suggestions: { label: string; value: string }[];
  //onChange?: ChangeEventHandler<HTMLInputElement>;
  onChange?: (value: string) => void;
};

const InputWithAutocomplete = forwardRef<
  React.ElementRef<typeof CommandInput>,
  React.ComponentPropsWithoutRef<typeof CommandInput> & Props
>(({ suggestions, className, onBlur, onFocus, onChange, ...props }, ref) => {
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
        placeholder="Location name..."
        className={className}
        {...props}
      />

      <div className="relative">
        <div className="absolute z-50 w-56">
          {open ? (
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
                    <Check className={cn("mr-2 h-4 w-4", search === suggestion.value ? "opacity-100" : "opacity-0")} />
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
});
InputWithAutocomplete.displayName = "InputWithAutocomplete";

export { InputWithAutocomplete };

function InputWithAutocompletex({ suggestions }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <Command className="w-56">
      <CommandInput
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        value={search}
        onValueChange={(x) => {
          setSearch(x);
        }}
        placeholder="Location name..."
        className=""
      />

      <div className="relative">
        <div className="absolute w-56">
          {open ? (
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
                    onSelect={(val) => setSearch(val)}
                  >
                    <Check className={cn("mr-2 h-4 w-4", search === suggestion.value ? "opacity-100" : "opacity-0")} />
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
