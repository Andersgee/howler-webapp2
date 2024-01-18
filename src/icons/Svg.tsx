import { cn } from "#src/utils/cn";

export type Props = React.SVGProps<SVGSVGElement>;

export function Svg({ className, children, ...props }: Props & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
      className={cn("h-6 w-6", className)}
    >
      {children}
    </svg>
  );
}
