import { Svg, type Props } from "./Svg";

export function IconBellWithNumber({ className, number, ...props }: { number: number } & Props) {
  return (
    <Svg className={className} {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      {number > 0 && (
        <g transform="translate(15,9)">
          <circle cx="0" cy="0" r="9" stroke="none" fill="#ef4444" />
          <text
            fontSize={10}
            fontWeight="lighter"
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            stroke="#ffffff"
            fill="none"
          >
            {number > 9 ? 9 : number}
          </text>
        </g>
      )}
    </Svg>
  );
}
