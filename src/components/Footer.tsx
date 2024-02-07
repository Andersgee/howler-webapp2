import { cn } from "#src/utils/cn";
import Link from "next/link";

type Props = {
  className?: string;
};

export function Footer({ className }: Props) {
  return (
    <>
      <div className={cn("flex w-full justify-between bg-color-neutral-100 p-2", className)}>
        <div>
          <Link href="/about" prefetch={false} className="underline decoration-solid">
            about
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="/privacy" prefetch={false} className="underline decoration-solid">
            privacy
          </Link>
          <Link href="/terms" prefetch={false} className="underline decoration-solid">
            terms
          </Link>
        </div>
      </div>
    </>
  );
}
