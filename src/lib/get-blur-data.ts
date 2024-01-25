import sharp from "sharp";

/**
 * # example
 * ```ts
 * const buf = await fetch(imageUrl).then((res) => res.arrayBuffer())
 * const base64 = await getBlurData(buf)
 * ```
 *
 * (this is identical to "plaiceholder" with default args)
 */
export async function getBlurData(src: Buffer | ArrayBuffer) {
  const size = 4;
  const brightness = 1;
  const saturation = 1.2;

  const { data, info } = await sharp(src)
    .resize(size, size, { fit: "inside" })
    .toFormat("png")
    .modulate({ brightness, saturation })
    .normalise()
    .toBuffer({ resolveWithObject: true });

  const base64 = `data:image/${info.format};base64,${data.toString("base64")}`;
  return base64;
}
