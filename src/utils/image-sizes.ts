import { SIZE } from "./image-sizes-constants.mjs";

type Width = keyof typeof SIZE;

type Options = {
  "sm"?: Width;
  "md"?: Width;
  "lg"?: Width;
  "xl"?: Width;
  "2xl"?: Width;
};

/**
 * helper for `<Image sizes="..."/>` media query prop with matching tailwind sizes
 *
 * ### example with src of unkown aspect ratio
 * ```jsx
 * <div className="relative h-32 w-64 md:h-44 md:w-96">
 *   <Image
 *     src={src}
 *     alt={alt}
 *     fill
 *     sizes={imageSizes("w-64", { md: "w-96" })}
 *     //object-cover or object-contain
 *     className="object-cover" />
 * </div>
 * ```
 *
 * ### example with known aspect ratio
 * ```jsx
 * <Image
 *   src={src}
 *   alt={alt}
 *   sizes={imageSizes("w-64", { md: "w-96" })}
 *   className="h-auto w-64 md:w-96"
 *   //width and height only for aspect ratio purpose
 *   width={256}
 *   height={Math.round(256 / aspectRatio)}
 * />
 * ```
 *
 * #### general note about `<Image sizes"...">`
 *
 * if using fill without specifying sizes, then default (in words) is "always load large enough image to cover entire screen width"
 *
 * eg `sizes="100vw"`
 *
 * or written more verbosely with this helper as
 *
 * `sizes=imageSizes("w-screen-2xl", {sm: "w-screen-md", md: "w-screen-xl", xl: "w-screen-2xl"})`
 */
export function imageSizes(width: Width, o?: Options) {
  const w = `${SIZE[width]}`;
  if (!o) return w;

  const xl2 = o["2xl"] ? `(min-width: ${SIZE["w-screen-2xl"]}) ${SIZE[o["2xl"]]}, ` : "";
  const xl = o.xl ? `(min-width: ${SIZE["w-screen-xl"]}) ${SIZE[o.xl]}, ` : "";
  const md = o.md ? `(min-width: ${SIZE["w-screen-md"]}) ${SIZE[o.md]}, ` : "";
  const sm = o.sm ? `(min-width: ${SIZE["w-screen-sm"]}) ${SIZE[o.sm]}, ` : "";
  return `${xl2}${xl}${md}${sm}${w}`;
}
