import { Svg, type Props } from "./Svg";

export function IconSend({ className, ...props }: Props) {
  return (
    <Svg className={className} {...props}>
      <path d="m3 3 3 9-3 9 19-9Z" />
      <path d="M6 12h16" />
    </Svg>
  );
}
