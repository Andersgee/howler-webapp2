"use client";

import { useStore } from "#src/store";
import Link from "next/link";
import { createPortal } from "react-dom";

export function ControlFooter() {
  const googleMaps = useStore.use.googleMaps();
  if (!googleMaps?.controls_element_footer) {
    return null;
  }
  return createPortal(<Content />, googleMaps.controls_element_footer);
}

function Content() {
  return (
    <div className="flex  text-[10px]/[14px] text-color-unthemed-neutral-1000">
      <Link
        href="/privacy"
        prefetch={false}
        className="bg-color-unthemed-neutral-100 bg-opacity-75 px-1.5 decoration-solid hover:underline"
      >
        Privacy
      </Link>
      <div className="w-[1px]"></div>
      <Link
        href="/terms"
        prefetch={false}
        className="bg-color-unthemed-neutral-100 bg-opacity-75 px-1.5 decoration-solid hover:underline"
      >
        Terms
      </Link>
    </div>
  );
}
