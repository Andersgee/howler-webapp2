import { Svg, type Props } from "./Svg";

export function IconCheck({ className, ...props }: Props) {
  return (
    <Svg className={className} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}
