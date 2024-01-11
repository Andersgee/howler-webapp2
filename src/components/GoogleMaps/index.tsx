"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { createHtmlPortalNode, InPortal, OutPortal } from "./reverse-portal";
import { useStore } from "#src/store";
import { absUrl } from "#src/utils/url";

/*
note to self:
to avoid reloading google maps in different places...
render it outside dom and "re-parent" it to appropriate places
not only will it be a better user experience (faster)
but also (I believe) I dont have to pay google for instantiating it multiple times.
*/

/**
 * renders google-maps without reloading everything (OutPortal)
 *
 * parent element decides size
 */
export function GoogleMaps() {
  const mapPortalNode = useStore.use.mapPortalNode();
  if (!mapPortalNode) return null;

  return <OutPortal node={mapPortalNode} />;
}

/**
 * load google-maps into an external dom node (InPortal)
 *
 * (This does not render google maps, use `<GoogleMaps />` for actually rendering)
 */
export function GoogleMapsPortal() {
  const mapSetPortalNode = useStore.use.mapSetPortalNode();
  const portalNode = useHtmlPortalNode();

  useEffect(() => {
    if (portalNode) {
      mapSetPortalNode(portalNode);
    }
  }, [portalNode, mapSetPortalNode]);

  if (!portalNode) return null;
  return (
    <InPortal node={portalNode} className="h-full w-full">
      <GoogleMapsDiv />
    </InPortal>
  );
}

export function GoogleMapsScript() {
  const loadGoogleMapsLibs = useStore.use.loadGoogleMapsLibs();
  return <Script src={absUrl("/google-maps.js")} strategy="lazyOnload" onLoad={() => loadGoogleMapsLibs()} />;
}

function GoogleMapsDiv() {
  const mapRef = useRef(null);
  const googleMapsIsReadyToRender = useStore.use.googleMapsLibsAreLoaded();
  const initGoogleMaps = useStore.use.initGoogleMaps();

  useEffect(() => {
    if (!googleMapsIsReadyToRender || !mapRef.current) return;
    initGoogleMaps(mapRef.current);
  }, [googleMapsIsReadyToRender, initGoogleMaps]);

  return <div ref={mapRef} className="h-full w-full" />;
}

function useHtmlPortalNode() {
  const [portalNode, setPortalNode] = useState<null | ReturnType<typeof createHtmlPortalNode>>(null);
  useEffect(() => {
    //more or less document.createElement()
    //this creates the <OutPortal> div that renders what you put as children to <InPortal>
    const node = createHtmlPortalNode({
      attributes: { style: "width:100%;height:100%;" },
    });
    setPortalNode(node);
  }, []);

  return portalNode;
}
