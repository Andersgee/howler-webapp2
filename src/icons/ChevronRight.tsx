import { Svg, type Props } from "./Svg";

export function IconChevronRight({ className, ...props }: Props) {
  return (
    <Svg className={className} {...props}>
      <path d="m9 18 6-6-6-6" />
    </Svg>
  );
}
