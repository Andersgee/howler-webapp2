"use client";

import { api } from "#src/hooks/api";
import { IconLoadingSpinner } from "#src/icons/special";
import { useStore } from "#src/store";
import { hashidFromId } from "#src/utils/hashid";
import { JSONE } from "#src/utils/jsone";
import Link from "next/link";
import { createPortal } from "react-dom";

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
      <div className="mb-2 text-lg font-medium text-color-unthemed-neutral-1000">{event.title}</div>
      <div className="w-48">{JSONE.stringify(event, 2)}</div>
    </Link>
  );
}
