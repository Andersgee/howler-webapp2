import { commandScore } from "#src/utils/command-score";
import { Command } from "cmdk";
import { type Key } from "react";

type Props = {
  className?: string;
  suggestions: { key: Key; value: string; label: string }[];
  value: string;
  /**
   * called whenever search input changes in any way
   *
   * also key will be defined if change was triggered by selecting a suggestion
   * */
  onChange: (search: string, key: Key | undefined) => void;
};

/*
tldr:
the Command.Input value filteres what Command.List to only show Command.Item with value
*/

//suggestions: { label: string; value: string; key: Key }[];

export function InputWithAutocomplete3({ className, suggestions, value, onChange }: Props) {
  //const [value, setValue] = useState("");
  return (
    <Command label="Command Menu" /*filter={(value, search) => commandScore(value, search)}*/>
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
