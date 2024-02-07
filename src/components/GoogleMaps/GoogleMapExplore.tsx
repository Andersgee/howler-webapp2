"use client";

import { GoogleMaps } from "#src/components/GoogleMaps";
import { ControlInfoWindow } from "#src/components/GoogleMaps/control-infowindow";
import { ControlSearch } from "#src/components/GoogleMaps/control-search";
//import { ControlLocate } from "#src/components/GoogleMaps/control-locate";
import { ControlFooter } from "./control-footer";

export function GoogleMapsExplore() {
  return (
    <>
      <style jsx global>{`
        html,
        body {
          height: 100%;
        }
      `}</style>
      <GoogleMaps />
      <ControlSearch />
      <ControlInfoWindow />
      {/*<ControlLocate />*/}
      <ControlFooter />
    </>
  );
}
