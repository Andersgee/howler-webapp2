"use client";

import { buttonVariants } from "#src/ui/button";
import * as Collapsible from "@radix-ui/react-collapsible";
import { cn } from "#src/utils/cn";
import { useState } from "react";

export default function Page() {
  const [advancedSearch, setAdvancedSearch] = useState(false);
  return (
    <div>
      <div>Collapsible..</div>
      <Collapsible.Root open={advancedSearch} onOpenChange={setAdvancedSearch}>
        <Collapsible.Trigger className={buttonVariants({ variant: "trigger", className: "group flex" })}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            className={cn("h-6 w-6", "transition-transform duration-200 group-data-state-open:rotate-180")}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          advanced
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div> some content here</div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
