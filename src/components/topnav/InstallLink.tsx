"use client";

import { useNotificationSettings } from "#src/hooks/useNotificationSettings";
import { buttonVariants } from "#src/ui/button";
import Link from "next/link";

type Props = {
  className?: string;
};

export function InstallLink({ className }: Props) {
  const { isStandalone } = useNotificationSettings();
  if (isStandalone === undefined || isStandalone === true) return null;
  return (
    <Link href="/install" className={buttonVariants({ variant: "primary", className })}>
      Get app
    </Link>
  );
}
