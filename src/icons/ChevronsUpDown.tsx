import { Svg, type Props } from "./Svg";

export function IconChevronsUpDown({ className, ...props }: Props) {
  return (
    <Svg className={className} {...props}>
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </Svg>
  );
}
