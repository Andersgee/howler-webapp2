"use client";

import { MoreHorizontal, User, Calendar, Tags, Trash, ChevronDown } from "#src/icons";

import { Button, buttonVariants } from "#src/ui/button";

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
          advanced
          <ChevronDown className={cn("transition-transform duration-200 group-data-state-open:rotate-180")} />
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div> some content here</div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
