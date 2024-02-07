import { cn } from "#src/utils/cn";
import { Footer } from "./Footer";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Shell({ className, children }: Props) {
  return (
    <div className={cn("flex min-h-screen-minus-nav flex-col items-center justify-between", className)}>
      <div className="px-2">{children}</div>
      <Footer />
    </div>
  );
}
