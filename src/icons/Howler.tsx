import { Svg, type Props } from "./Svg";

export function IconHowler({ className, ...props }: Props) {
  return (
    <Svg className={className} viewBox="0 0 475 475" {...props}>
      <circle cx="237" cy="237" r="220" fill="#fff" />
      <path stroke="#000" strokeWidth="21" d="M 237 17 A 220 220 0 0 1 457 237" />
      <path
        stroke="#172554"
        fill="#2563eb"
        strokeWidth="14"
        d="M 326.5 351
	L 289 449
	A 220 220 0 0 1 50.5 352.5
	L 50.5 352.5
	L 138.5 208.5
	L 106.5 152.5
	L 179.5 145.5
	L 241 110.5
	H 277.5
	L 380 29
	L 397 69
	L 386 110.5
	L 401 96
	L 424.5 105.5
	V 134 
	L 367 195.5
	L 326.5 277	
	z"
      />
      <path stroke="#000" strokeWidth="21" d="M 237 17 A 220 220 0 1 0 457 237 " />
    </Svg>
  );
}
