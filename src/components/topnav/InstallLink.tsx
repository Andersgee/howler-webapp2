"use client";

import { useNotificationSettings } from "#src/hooks/useNotificationSettings";
import { dialogDispatch } from "#src/store/slices/dialog";
import { buttonVariants } from "#src/ui/button";
import Link from "next/link";

type Props = {
  className?: string;
};

export function InstallLink({ className }: Props) {
  const { isStandalone } = useNotificationSettings();
  if (isStandalone === undefined || isStandalone === true) return null;
  return (
    <Link
      href="/install"
      className={buttonVariants({ variant: "primary", className })}
      onClick={() => dialogDispatch({ type: "hide", name: "profilebutton" })}
    >
      Get the app
    </Link>
  );
}
