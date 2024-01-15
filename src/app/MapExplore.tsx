"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { type RouterOutputs } from "#src/hooks/api";
import { InfoWindow } from "./ExploreInfoWindow";
import { ExploreFilterControl } from "./ExploreFilterControl";

type Props = {
  initialEvents: RouterOutputs["event"]["getAll"];
};

export function MapExplore({ initialEvents }: Props) {
  return (
    <div>
      <div className="h-96 w-full">
        <GoogleMaps />
        <ExploreFilterControl />
        <InfoWindow />
      </div>
    </div>
  );
}
