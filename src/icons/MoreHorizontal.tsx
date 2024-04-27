import { Svg, type Props } from "./Svg";

export function IconMoreHorizontal({ className, ...props }: Props) {
  return (
    <Svg className={className} {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </Svg>
  );
}
