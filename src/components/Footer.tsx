import { cn } from "#src/utils/cn";
import Link from "next/link";

type Props = {
  className?: string;
};

export function Footer({ className }: Props) {
  return (
    <div className={cn("flex w-full justify-between bg-color-neutral-100 p-2 text-sm", className)}>
      <div>
        <Link href="/about" prefetch={false} className="text-color-neutral-700 decoration-solid hover:underline">
          About
        </Link>
      </div>
      <div className="flex gap-4">
        <Link href="/privacy" prefetch={false} className="text-color-neutral-700 decoration-solid hover:underline">
          Privacy
        </Link>
        <Link href="/terms" prefetch={false} className="text-color-neutral-700 decoration-solid hover:underline">
          Terms
        </Link>
      </div>
    </div>
  );
}
