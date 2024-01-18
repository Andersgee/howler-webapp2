import { Svg, type Props } from "./Svg";

export function IconCircle({ className, ...props }: Props) {
  return (
    <Svg className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
    </Svg>
  );
}
