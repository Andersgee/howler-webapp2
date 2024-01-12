"use client";

import { cn } from "#src/utils/cn";
import { useEffect } from "react";
import { ReversePortal } from "./portalstuff";
import { setPortalstuffElement, useStore } from "#src/store";
import { createPortal } from "react-dom";
import { Button } from "#src/ui/button";

type Props = {
  className?: string;
};

export function SomExpensiveComp({ className }: Props) {
  useEffect(() => {
    console.log("running useEffect in SomExpensiveComp");
  }, []);

  return (
    <div className={cn("", className)}>
      <h2>SomExpensiveComp</h2>
      <Button onClick={() => console.log("hello from click")}>click me</Button>
    </div>
  );
}

export function MountSomeExpensiveComp() {
  const element = useStore.use.portalstuffElement();
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("style", "width:100%;height:100%;");
    setPortalstuffElement(el);
  }, []);

  if (!element) {
    return null;
  }
  return createPortal(<SomExpensiveComp />, element);
}

export function PreloadedSomExpensiveComp() {
  const element = useStore.use.portalstuffElement();
  if (!element) {
    return null;
  }
  return <ReversePortal element={element} />;
}
