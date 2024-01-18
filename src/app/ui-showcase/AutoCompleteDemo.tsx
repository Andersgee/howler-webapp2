"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { cn } from "#src/utils/cn";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "#src/ui/command";
import { IconCheck } from "#src/icons/Check";

export function AutoCompleteDemo() {
  const options: Option[] = [
    { label: "mama", value: "lele" },
    { label: "mama2", value: "lele2" },
    { label: "mama5", value: "lele5" },
  ];

  return (
    <AutoComplete
      emptyMessage="empy msg"
      onValueChange={(v) => {
        console.log(v);
      }}
      options={options}
    />
  );
}

export type Option = Record<"value" | "label", string> & Record<string, string>;

type Props = {
  options: Option[];
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

function AutoComplete({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(value);
  const [inputValue, setInputValue] = useState<string>(value?.label ?? "");

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find((option) => option.label === input.value);
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onValueChange]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    //setInputValue(selected?.label ?? "");
  }, []);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange]
  );

  return (
    <Command onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base"
        />
      </div>
      <div className="relative mt-1">
        {isOpen ? (
          <div className="rounded-xl bg-stone-50 absolute top-0 z-10 w-full outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="ring-slate-200 rounded-lg ring-1">
              {isLoading ? (
                <CommandLoading>
                  <div className="p-1">
                    {/*<Skeleton className="h-8 w-full" />*/}
                    skeleton
                  </div>
                </CommandLoading>
              ) : null}
              {options.length > 0 && !isLoading ? (
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = selected?.value === option.value;
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(option)}
                        className={cn("flex w-full items-center gap-2", !isSelected ? "pl-8" : null)}
                      >
                        {isSelected ? <IconCheck className="w-4" /> : null}
                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandEmpty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                  {emptyMessage}
                </CommandEmpty>
              ) : null}
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
