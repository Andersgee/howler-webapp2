"use client";

import { cn } from "#src/utils/cn";
import { useEffect } from "react";

import { setPortalstuffElement, useStore } from "#src/store";
import { createPortal } from "react-dom";
import { Button } from "#src/ui/button";
import { ReversePortal } from "#src/lib/reverse-portal";

type Props = {
  className?: string;
};

function SomExpensiveComp({ className }: Props) {
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

export function PreloadedExpensiveComp() {
  const element = useStore.use.portalstuffElement();
  if (!element) {
    return null;
  }
  return <ReversePortal element={element} />;
}

export function MountSomeExpensiveComp(props: Props) {
  const element = useStore.use.portalstuffElement();
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("style", "width:100%;height:100%;");
    setPortalstuffElement(el);
  }, []);

  if (!element) {
    return null;
  }
  return createPortal(<SomExpensiveComp {...props} />, element);
}