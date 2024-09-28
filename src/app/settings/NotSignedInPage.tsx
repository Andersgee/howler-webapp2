"use client";

import { useStore } from "#src/store";
import { Button } from "#src/ui/button";
import { cn } from "#src/utils/cn";

import { useEffect } from "react";

type Props = {
  className?: string;
};

export function NotSignedInPage({ className }: Props) {
  const setDialogValue = useStore.use.setDialogValue();
  useEffect(() => {
    setDialogValue("profilebutton");
  }, [setDialogValue]);
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="px-2">
        <section className="flex flex-col items-center">
          <h1 className="mt-2">Not signed in</h1>
          <Button onClick={() => setDialogValue("profilebutton")}>Sign in</Button>
        </section>
      </div>
    </div>
  );
}
