import { Svg, type Props } from "./Svg";

export function IconChevronDown({ className, ...props }: Props) {
  return (
    <Svg className={className} {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}
