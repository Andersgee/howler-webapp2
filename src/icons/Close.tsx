import { Svg, type Props } from "./Svg";

export function IconClose({ className, ...props }: Props) {
  return (
    <Svg className={className} {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  );
}
