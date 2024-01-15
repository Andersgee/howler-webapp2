import { Command } from "cmdk";

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
  return (
    <Command>
      <Command.Input
        className="bg-color-neutral-0 text-color-neutral-1000"
        value={value}
        //when typing in search field (not triggered when selecting an option)
        onValueChange={(search) => onChange(search, undefined)}
      />

      <Command.List>
        <Command.Group heading="Suggestions">
          {suggestions.map((x) => (
            <Command.Item
              className="cursor-pointer hover:bg-color-neutral-400 aria-selected:bg-color-neutral-200 "
              key={x.key}
              value={x.value}
              //when selecting an option with mouse/keyboard only
              onSelect={() => onChange(x.label, x.key)}
            >
              {x.label}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command>
  );
}
