"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useStore } from "#src/store";
import { absUrl } from "#src/utils/url";
import { ReversePortal } from "#src/lib/reverse-portal";
import { initGoogleMaps, setGoogleMapsElement } from "#src/store/actions";

/** parent decides size */
export function GoogleMaps() {
  const googleMaps = useStore.use.googleMaps();
  const element = useStore.use.googleMapsElement();
  if (!googleMaps) {
    return <MountGoogleMaps />;
  }
  if (!element) {
    return null;
  }
  return <ReversePortal element={element} />;
}

function MountGoogleMaps() {
  const [googleMapsScriptIsLoaded, setGoogleMapsScriptIsLoaded] = useState(false);
  const element = useStore.use.googleMapsElement();
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("style", "width:100%;height:100%;background-color: hsl(var(--color-neutral-50));");
    setGoogleMapsElement(el);
  }, []);

  useEffect(() => {
    if (!googleMapsScriptIsLoaded || !element) return;

    initGoogleMaps(element)
      .then(() => {
        console.log("initGoogleMaps ok");
      })
      .catch(() => {
        console.log("initGoogleMaps fail");
      });
  }, [googleMapsScriptIsLoaded, element]);

  return (
    <Script src={absUrl("/google-maps.js")} strategy="lazyOnload" onLoad={() => setGoogleMapsScriptIsLoaded(true)} />
  );
}
