"use client";

import { usePathname } from "next/navigation";
import { buttonVariants } from "#src/ui/button";

type Props = {
  children: React.ReactNode;
};

export function SignoutButton({ children }: Props) {
  const pathname = usePathname();

  return (
    <a
      className={buttonVariants({ variant: "outline", className: "block" })}
      href={`/api/auth/signout?route=${pathname}`}
    >
      {children}
    </a>
  );
}
