"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { IconLoadingSpinner } from "#src/icons/special";
import { useStore } from "#src/store";
import { setGoogleMapsExploreSelectedEventId } from "#src/store/actions";
import { trimSearchOperators } from "#src/trpc/routers/eventSchema";
import { Input } from "#src/ui/input";
import { InputWithAutocomplete3 } from "#src/ui/input-with-autocomplete3";
import { Switch } from "#src/ui/switch";
import { datetimelocalString } from "#src/utils/date";
import { hashidFromId } from "#src/utils/hashid";
import { JSONE } from "#src/utils/jsone";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function ExploreFilterControl() {
  const googleMaps = useStore.use.googleMaps();
  if (!googleMaps?.controls_element_search) {
    return null;
  }
  return createPortal(<ExploreFilterControlContent />, googleMaps.controls_element_search);
}

function ExploreFilterControlContent() {
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
    //googleMaps.addEventsAsMarkers(initialEvents);
    //googleMaps.map.setOptions({
    //  center: latLng,
    //  heading: 0,
    //  zoom: 11,
    //});
  }, [googleMaps]);

  useEffect(() => {
    if (!data || !googleMaps) return;
    googleMaps.markerClusterer.clearMarkers();
    if (data.withScore) {
      googleMaps.addEventsAsMarkers(data.events.filter((x) => x.score! > 0));
    } else {
      //no search string filter... just show all
      googleMaps.addEventsAsMarkers(data.events);
    }
  }, [data, googleMaps]);

  return (
    <div>
      <div>what / where</div>
      <InputWithAutocomplete3
        //suggestions={
        //  data?.events && data.withScore ? data.events.filter((x) => x.score! > 0).map(suggestionFromEvent) : []
        //}
        suggestions={
          data?.events
            ? data.withScore
              ? data.events.filter((x) => x.score! > 0).map(suggestionFromEvent)
              : data.events.map(suggestionFromEvent)
            : []
        }
        value={text}
        onChange={(s, id) => {
          setText(s);
          if (id !== undefined) {
            //selected a suggestion
            const ev = data?.events.find((x) => x.id === id);
            if (googleMaps && ev) {
              setGoogleMapsExploreSelectedEventId(id);
              const latLng = { lat: ev.location.coordinates[0], lng: ev.location.coordinates[1] };
              googleMaps.infoWindow.setPosition(latLng);
              googleMaps.infoWindow.open({ map: googleMaps.map, shouldFocus: false });
              googleMaps.map.panTo(latLng);
              //googleMaps.map.setOptions({
              //  center: latLng,
              //  //heading: 0,
              //  //zoom: 11,
              //});
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
  );
}

function suggestionFromEvent(e: RouterOutputs["event"]["getExplore"]["events"][number]) {
  return {
    key: e.id,
    label: `${e.title} ${e.locationName ?? ""}`.trim(),
    value: `${e.title} ${e.locationName ?? ""} ${hashidFromId(e.id)}`.trim(),
  };
}
