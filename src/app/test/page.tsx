"use client";

import { api } from "#src/hooks/api";
import { trimSearchOperators } from "#src/trpc/routers/eventSchema";
import { Input } from "#src/ui/input";
import { Switch } from "#src/ui/switch";
import { cn } from "#src/utils/cn";
import { datetimelocalString } from "#src/utils/date";
import { JSONE } from "#src/utils/jsone";
import { useState } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const { data } = api.event.getFiltered.useQuery(
    {
      titleOrLocationName: trimSearchOperators(text).length >= 3 ? trimSearchOperators(text) : undefined,
      minDate: checked ? minDate : undefined,
    },
    {
      //enabled: trimSearchOperators(text).length >= 3,
    }
  );
  return (
    <div>
      <div>what / where</div>
      <Input type="text" value={text} onChange={(e) => setText(e.target.value)} />

      <div>
        <p>when</p>
        <div className="flex items-center gap-2">
          <Input
            type="datetime-local"
            value={datetimelocalString(minDate)}
            onChange={(e) => {
              if (!e.target.value) return;
              setMinDate(new Date(e.target.value));
            }}
            className="w-auto"
          />
          <Switch checked={checked} onCheckedChange={setChecked} />
          <p>{checked ? "only after this date" : "anytime"}</p>
        </div>
      </div>

      <div>
        {data?.map((event) => (
          <div key={event.id}>
            id:{event.id.toString()}, title: {event.title}, locationName:{event.locationName}
          </div>
        ))}
      </div>
      {/*<pre>data: {JSONE.stringify(data, 2)}</pre>*/}
    </div>
  );
}
