"use client";

import { api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";
import { hashidFromId } from "#src/utils/hashid";
import Link from "next/link";

type Props = {
  className?: string;
};

export function MyPacksList({ className }: Props) {
  const { data: packs } = api.pack.listMy.useQuery();
  return (
    <div className={cn("space-y-2", className)}>
      <h2>My packs</h2>
      {packs?.map((pack) => (
        <Link href={`/pack/${hashidFromId(pack.id)}`} key={pack.id} className="block bg-color-neutral-0 p-2">
          {`${pack.title} (${pack.memberCount} members)`}
        </Link>
      ))}
    </div>
  );
}
