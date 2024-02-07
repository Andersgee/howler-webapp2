import { cn } from "#src/utils/cn";
import { Footer } from "./Footer";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Shell({ className, children }: Props) {
  return (
    <div className="mx-auto flex min-h-screen-minus-nav flex-col items-center justify-between">
      <div className={cn("px-2", className)}>{children}</div>
      <Footer />
    </div>
  );
}
