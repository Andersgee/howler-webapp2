"use client";

import { api } from "#src/hooks/api";
import { IconLoadingSpinner } from "#src/icons/special";
import { useStore } from "#src/store";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Eventinfo } from "#src/app/event/[hashid]/Eventinfo";

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
      <div className="flex h-24 w-48 items-center justify-center bg-color-neutral-0">
        <IconLoadingSpinner className="text-color-neutral-600" />
      </div>
    );

  return (
    <Link className="block bg-color-neutral-0 hover:bg-color-neutral-300" href={`/event/${hashidFromId(event.id)}`}>
      <Eventinfo event={event} className="p-2" />
    </Link>
  );
}
