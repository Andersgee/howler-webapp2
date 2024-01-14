"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { api, type RouterOutputs } from "#src/hooks/api";
import { useStore } from "#src/store";
import { useEffect, useState } from "react";
import { InfoWindow } from "./ExploreInfoWindow";
import { trimSearchOperators } from "#src/trpc/routers/eventSchema";
import { Input } from "#src/ui/input";
import { datetimelocalString } from "#src/utils/date";
import { Switch } from "#src/ui/switch";
import { InputWithAutocomplete } from "#src/ui/input-with-autocomplete";

type Props = {
  initialEvents: RouterOutputs["event"]["getAll"];
};

export function MapExplore({ initialEvents }: Props) {
  const googleMaps = useStore.use.googleMaps();
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const { data } = api.event.getExplore.useQuery(
    {
      titleOrLocationName: trimSearchOperators(text).length >= 3 ? trimSearchOperators(text) : undefined,
      minDate: checked ? minDate : undefined,
    },
    {
      //enabled: trimSearchOperators(text).length >= 3,
    }
  );

  useEffect(() => {
    if (!googleMaps) return;

    googleMaps.setMode("explore");
    googleMaps.addEventsAsMarkers(initialEvents);
    //googleMaps.map.setOptions({
    //  center: latLng,
    //  heading: 0,
    //  zoom: 11,
    //});
  }, [googleMaps, initialEvents]);

  useEffect(() => {
    if (!data || !googleMaps) return;
    googleMaps.setMode("explore");
    if (data.withScore) {
      googleMaps.addEventsAsMarkers(data.events.filter((x) => !!x.location && !!x.score && x.score > 0));
    } else {
      //no search string filter... just show all
      googleMaps.addEventsAsMarkers(data.events.filter((x) => !!x.location));
    }
  }, [data, googleMaps]);

  return (
    <div>
      <div>
        <div>what / where</div>
        <InputWithAutocomplete
          placeholder="anything and anywhere..."
          suggestions={
            data?.events.map((event) => ({
              label: event.location ? event.title : `${event.title} (anywhere)`,
              value: event.title,
              key: event.id,
            })) ?? []
          }
          value={text}
          onChange={setText}
        />
        {/*<Input type="text" value={text} onChange={(e) => setText(e.target.value)} />*/}

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
      </div>

      <div className="h-96 w-full">
        <GoogleMaps />
      </div>
      <InfoWindow />

      <div>
        {data?.events?.map((event) => (
          <div key={event.id}>
            id:{event.id.toString()}, score: {event.score ?? "nope"}
          </div>
        ))}
      </div>
    </div>
  );
}
