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
import { JSONE } from "#src/utils/jsone";
import { InputWithAutocomplete3 } from "#src/ui/input-with-autocomplete3";
import { hashidFromId } from "#src/utils/hashid";
import { setGoogleMapsExploreSelectedEventId } from "#src/store/actions";

type Props = {
  initialEvents: RouterOutputs["event"]["getAll"];
};

export function MapExplore({ initialEvents }: Props) {
  const googleMaps = useStore.use.googleMaps();
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(true);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const { data } = api.event.getExplore.useQuery(
    {
      titleOrLocationName: trimSearchOperators(text).length >= 3 ? trimSearchOperators(text) : undefined,
      minDate: !checked ? minDate : undefined,
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
        <InputWithAutocomplete3
          //placeholder="anything and anywhere..."
          suggestions={
            data?.events.map((e) => ({
              key: e.id,
              label: `${e.title} ${e.locationName ?? ""}`.trim(),
              value: `${e.title} ${e.locationName ?? ""} ${hashidFromId(e.id)}`.trim(),
            })) ?? []
          }
          value={text}
          onChange={(s, id) => {
            setText(s);
            if (id !== undefined) {
              //selected a suggestion
              const ev = data?.events.find((x) => x.id === id);
              if (googleMaps) {
                if (ev?.location) {
                  setGoogleMapsExploreSelectedEventId(id);
                  const latLng = { lat: ev.location.coordinates[0], lng: ev.location.coordinates[1] };
                  googleMaps.infoWindow.setPosition(latLng);
                  googleMaps.infoWindow.open({ map: googleMaps.map, shouldFocus: false });
                  googleMaps.map.setOptions({
                    center: latLng,
                    heading: 0,
                    zoom: 11,
                  });
                } else {
                  console.log("seleced event has no location");
                  googleMaps.infoWindow.close();
                }
              } else {
                console.log("no google maps");
              }
            }
          }}
        />
        <div>
          <p>when</p>
          <div className="flex items-center gap-2">
            <Switch checked={checked} onCheckedChange={setChecked} />
            <p>{checked ? "anytime" : "only after this date"}</p>
          </div>
          {!checked && (
            <Input
              type="datetime-local"
              value={datetimelocalString(minDate)}
              onChange={(e) => {
                if (!e.target.value) return;
                setMinDate(new Date(e.target.value));
              }}
              className="mb-2 w-auto"
            />
          )}
        </div>
      </div>

      <div className="h-96 w-full">
        <GoogleMaps />
      </div>
      <InfoWindow />
    </div>
  );
}
