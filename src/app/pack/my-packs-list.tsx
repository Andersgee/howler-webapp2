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
    <div className={cn("", className)}>
      <div>PackList</div>
      {packs?.map((pack) => (
        <Link href={`/pack/${hashidFromId(pack.id)}`} key={pack.id} className="block">
          <h3>{pack.title}</h3>
        </Link>
      ))}
    </div>
  );
}
