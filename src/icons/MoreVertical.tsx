import { Svg, type Props } from "./Svg";

export function IconMoreVertical({ className, ...props }: Props) {
  return (
    <Svg className={className} {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </Svg>
  );
}
