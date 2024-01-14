"use client";

import { api } from "#src/hooks/api";
import { trimSearchOperators } from "#src/trpc/routers/eventSchema";
import { Input } from "#src/ui/input";
import { cn } from "#src/utils/cn";
import { JSONE } from "#src/utils/jsone";
import { useState } from "react";

export default function Page() {
  const [text, setText] = useState("");
  const { data } = api.event.getFiltered.useQuery(
    { titleOrLocationName: trimSearchOperators(text) },
    {
      enabled: trimSearchOperators(text).length >= 3,
    }
  );
  return (
    <div>
      <div>input</div>
      <Input type="text" value={text} onChange={(e) => setText(e.target.value)} />

      <div>
        {data?.map((event) => (
          <div key={event.id}>
            score: {event.score ?? 0}, id:{event.id.toString()}, title: {event.title}, locationName:{event.locationName}
          </div>
        ))}
      </div>
      {/*<pre>data: {JSONE.stringify(data, 2)}</pre>*/}
    </div>
  );
}
