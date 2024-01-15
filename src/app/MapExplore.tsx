"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { type RouterOutputs } from "#src/hooks/api";
import { InfoWindow } from "#src/components/GoogleMaps/ExploreInfoWindow";
import { ExploreFilterControl } from "#src/components/GoogleMaps/ExploreFilterControl";

type Props = {
  initialEvents: RouterOutputs["event"]["getAll"];
};

export function MapExplore({ initialEvents }: Props) {
  return (
    <div className="h-96 w-full">
      <GoogleMaps />
      <ExploreFilterControl />
      <InfoWindow />
    </div>
  );
}
