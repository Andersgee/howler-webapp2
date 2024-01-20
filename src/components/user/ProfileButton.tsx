"use client";

import { useStore } from "#src/store";
import { SigninButtons } from "./SigninButtons";
import { SignoutButton } from "./SignoutButton";
import { UserImage32x32 } from "./UserImage";
import { type TokenUser } from "#src/utils/jwt/schema";
import { Popover, PopoverContent, PopoverTrigger } from "#src/ui/popover";
import { Button } from "#src/ui/button";
import { dialogDispatch } from "#src/store/slices/dialog";

type Props = {
  user: TokenUser | null;
};

export function ProfileButton({ user }: Props) {
  //const user = useStore.use.user();
  const dialogValue = useStore.use.dialogValue();

  return (
    <Popover
      open={dialogValue === "profilebutton"}
      onOpenChange={(open) => dialogDispatch({ type: open ? "show" : "hide", name: "profilebutton" })}
    >
      {user ? (
        <>
          <PopoverTrigger className="rounded-md p-1.5 outline-none hover:bg-color-neutral-200 focus-visible:focusring">
            <UserImage32x32 image={user.image} alt={user.name} />
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-4">
              <div className="mb-2">{user.name}</div>
              <SignoutButton>Sign out</SignoutButton>
            </div>
          </PopoverContent>
        </>
      ) : (
        <>
          <PopoverTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap">
              Sign in
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <SigninButtons />
            </div>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
