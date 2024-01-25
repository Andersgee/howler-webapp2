import sharp from "sharp";

/**
 * this is what npm package "plaiceholder" does by default
 *
 * it uses "sharp" so not for browser use.
 *
 * # Example
 * ```ts
 * const imageData = await fetch(imageUrl).then((res) => res.arrayBuffer());
 * const placeholderData = getPlaceholderData(imageData)
 * const blurDataURL = `data:image/png;base64,${placeholderData.toString("base64")}`;
 * ```
 * usage in nextjs looks like so:
 * ```jsx
 * <Image src={imageUrl} placeholder="blur" blurDataURL={blurDataURL}/>
 * ```
 */
export async function getPlaceholderData(imageBuffer: Buffer | ArrayBuffer) {
  return await sharp(imageBuffer)
    .resize(4, 4, { fit: "inside" })
    .toFormat("png")
    .modulate({ brightness: 1, saturation: 1.2 })
    .normalise()
    .toBuffer();
}
