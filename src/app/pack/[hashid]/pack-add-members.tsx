"use client";

import { UserImage96x96 } from "#src/components/user/UserImage";
import { api } from "#src/hooks/api";
import { IconCheck } from "#src/icons/Check";
import { Button } from "#src/ui/button";
import { Input } from "#src/ui/input";
import { cn } from "#src/utils/cn";
import { JSONE } from "#src/utils/jsone";
import { useState } from "react";

type Props = {
  className?: string;
  packId: bigint;
  //pack: NonNullable<RouterOutputs["pack"]["getById"]>;
  packRole?: "CREATOR" | "ADMIN" | "MEMBER";
};

export function PackAddMembers({ packId, className }: Props) {
  const [hashid, setHashid] = useState("");
  const utils = api.useUtils();

  const { data: user } = api.user.getByHashid.useQuery({ hashid });
  const { mutate, isPending } = api.pack.addUser.useMutation({
    onSuccess: (data, variables, context) => {
      void utils.pack.invalidate();
      setHashid("");
    },
  });
  return (
    <div className={cn("", className)}>
      <p className="">You can add people to the pack with their howler id</p>
      <Input placeholder="pQyL0" value={hashid} onChange={(e) => setHashid(e.target.value)} />
      {user ? (
        <div className="flex flex-col items-center gap-2">
          <UserImage96x96 alt={user.name} image={user.image} />
          <div className="">{user.name}</div>
          <Button variant="positive" disabled={isPending} onClick={() => mutate({ packId, userId: user.id })}>
            <IconCheck /> Add to pack
          </Button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
