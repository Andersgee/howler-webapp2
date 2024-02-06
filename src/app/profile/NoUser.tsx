"use client";

import { dialogDispatch } from "#src/store/slices/dialog";
import { Button } from "#src/ui/button";
import { cn } from "#src/utils/cn";

import { useEffect } from "react";

type Props = {
  className?: string;
};

export function NoUser({ className }: Props) {
  useEffect(() => {
    dialogDispatch({ type: "show", name: "profilebutton" });
  }, []);
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="px-2">
        <section className="flex flex-col items-center">
          <h1 className="mt-2">Not signed in</h1>
          <Button onClick={() => dialogDispatch({ type: "show", name: "profilebutton" })}>Sign in</Button>
        </section>
      </div>
    </div>
  );
}
