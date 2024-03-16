import sharp from "sharp";
import fs from "fs/promises";

void main();

/*
pnpm tsx scripts/image-optimize.ts
*/

async function main() {
  const path = "varavagar-karta-2024.png";
  const width = 1200;

  const { exists, isDir, isFile } = await stat(path);
  if (!exists || isDir) {
    console.log(`${path} is not a file.`);
    return;
  }

  if (isFile) {
    await optimizeAndSave(path, width);
  }
}

async function optimizeAndSave(file: string, width: number) {
  const outFile = `${file.split(".")[0]}-${width}.png`;
  try {
    const info = await sharp(file).resize(width).png().toFile(outFile);
    console.log(`saved: ${outFile},\t size: ${info.width}x${info.height}`);
  } catch (error) {
    console.log(error);
  }
}

async function stat(path: string) {
  try {
    const r = await fs.lstat(path);
    return { exists: true, isDir: r.isDirectory(), isFile: r.isFile() };
  } catch {
    return { exists: false, isDir: false, isFile: false };
  }
}
