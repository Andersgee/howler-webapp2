"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { type RouterOutputs } from "#src/hooks/api";
import { ControlInfoWindow } from "#src/components/GoogleMaps/control-infowindow";
import { ControlSearch } from "#src/components/GoogleMaps/control-search";
import { ControlLocate } from "#src/components/GoogleMaps/control-locate";

type Props = {
  initialEvents: RouterOutputs["event"]["getAll"];
};

export function MapExplore({ initialEvents }: Props) {
  return (
    <div className="h-screen w-full">
      <GoogleMaps />
      <ControlSearch />
      <ControlInfoWindow />
      <ControlLocate />
    </div>
  );
}
