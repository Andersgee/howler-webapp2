"use client";

import { api } from "#src/hooks/api";
import { IconWhat, IconWhen, IconWhere, IconWho } from "#src/icons";
import { IconLoadingSpinner } from "#src/icons/special";
import { useStore } from "#src/store";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";
import { createPortal } from "react-dom";
import { PrettyDate } from "../PrettyDate";

export function ControlInfoWindow() {
  const googleMaps = useStore.use.googleMaps();
  if (!googleMaps?.controls_element_infowindow) {
    return null;
  }
  return createPortal(<Content />, googleMaps.controls_element_infowindow);
}

function Content() {
  const googleMapsExploreSelectedEventId = useStore.use.googleMapsExploreSelectedEventId();

  const { data: event, isLoading } = api.event.getById.useQuery(
    { id: googleMapsExploreSelectedEventId! },
    {
      enabled: !!googleMapsExploreSelectedEventId,
    }
  );

  if (!event || isLoading)
    return (
      <div className="flex h-24 w-48 items-center justify-center bg-color-unthemed-neutral-0">
        <IconLoadingSpinner className="text-color-unthemed-neutral-600" />
      </div>
    );

  return (
    <Link
      className="block bg-color-unthemed-neutral-0 text-color-unthemed-neutral-800 hover:bg-color-unthemed-neutral-300"
      href={`/event/${hashidFromId(event.id)}`}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <IconWhat />
          <div className="w-11 shrink-0">What</div>
          <h1 className="m-0 capitalize-first">{event.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <IconWhere />
          <div className="w-11 shrink-0">Where</div>
          <div className="capitalize-first">{event.locationName ?? "anywhere"}</div>
        </div>
        <div className="flex items-center gap-2">
          <IconWhen />
          <div className="w-11 shrink-0">When</div>
          <div>
            <PrettyDate date={event.date} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconWho />
          <div className="w-11 shrink-0">Who</div>
          <div>anyone</div>
        </div>
      </div>
    </Link>
  );
}
