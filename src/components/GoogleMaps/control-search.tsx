"use client";

import { type RouterOutputs, api } from "#src/hooks/api";
import { useStore } from "#src/store";
import { setGoogleMapsExploreSelectedEventId } from "#src/store/actions";
import { trimSearchOperators } from "#src/trpc/routers/eventSchema";
import { Input } from "#src/ui/input";
import { datetimelocalString } from "#src/utils/date";
import { hashidFromId } from "#src/utils/hashid";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { InputSearch } from "./InputSearch";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { Label } from "#src/ui/label";

export function ControlSearch() {
  const googleMaps = useStore.use.googleMaps();
  if (!googleMaps?.controls_element_search) {
    return null;
  }
  return createPortal(<Content />, googleMaps.controls_element_search);
}

const MS_ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

function Content() {
  const googleMaps = useStore.use.googleMaps();
  const [text, setText] = useState("");
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date(Date.now() + MS_ONE_WEEK));
  const { data } = api.event.getExplore.useQuery(
    {
      titleOrLocationName: text,
      minDate: advancedSearch ? minDate : undefined,
      maxDate: advancedSearch ? maxDate : undefined,
    },
    {
      //enabled: trimSearchOperators(text).length >= 3,
      //staleTime: 10000, //just for testing
      notifyOnChangeProps: ["data"], //not sure if needed.. default is smart-tracking but what does that mean?
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
    <Collapsible open={advancedSearch} onOpenChange={setAdvancedSearch} className="m-2">
      <InputSearch
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

      <CollapsibleContent className="mt-2 rounded-lg bg-color-neutral-50 p-2">
        <div>
          <div className="mb-1 mt-3">
            <Label htmlFor="earliest-date">Earliest date</Label>
          </div>
          <Input
            id="earliest-date"
            type="datetime-local"
            className="w-full border-none outline-none"
            value={datetimelocalString(minDate)}
            onChange={(e) => {
              if (!e.target.value) return;
              setMinDate(new Date(e.target.value));
            }}
          />
          <div className="mb-1 mt-3">
            <Label htmlFor="latest-date">Latest date</Label>
          </div>
          <Input
            id="latest-date"
            type="datetime-local"
            className="w-full border-none outline-none"
            value={datetimelocalString(maxDate)}
            onChange={(e) => {
              if (!e.target.value) return;
              setMaxDate(new Date(e.target.value));
            }}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function suggestionFromEvent(e: RouterOutputs["event"]["getExplore"]["events"][number]) {
  return {
    key: e.id,
    label: `${e.title} ${e.locationName ?? ""}`.trim(),
    value: `${e.title} ${e.locationName ?? ""} ${hashidFromId(e.id)}`.trim(),
  };
}
