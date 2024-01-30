import sharp from "sharp";
import fs from "fs/promises";

void main();

/*
pnpm tsx scripts/icon-generate.ts -f public/icons/favicon.svg -w 48
=> public/icons/favicon-48.png
*/

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== "-f" || args[1]!.length < 1 || args[2] !== "-w" || isNaN(Number(args[3]))) {
    console.log('EXAMPLE USAGE ARGS: "-f myimage.png -w 384"');
    return { ok: false, path: "", width: 0 };
  }

  return { ok: true, path: args[1]!, width: Number(args[3]) };
}

async function main() {
  const { ok, path, width } = parseArgs();
  if (!ok) return;

  //const path = "public/icons/favicon.svg";
  //const width = 512;

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
    const info = await sharp(file)
      .resize(width)

      .png()
      .toFile(outFile);
    console.log(`saved: ${outFile},\t size: ${info.width}x${info.height}`);
  } catch (error) {
    console.log(error);
  }
}

async function optimizeAndSavePadded(file: string, width: number) {
  const outFile = `${file.split(".")[0]}-${width}.png`;
  //const pad = 52; //maskable padding should be 10% of final width, meaning 512 width => 51.2 => 52
  const pad = Math.ceil(width * 0.1);
  try {
    const info = await sharp(file)
      .resize(width - pad * 2)
      .extend({
        background: "#ffffff",
        top: pad,
        right: pad,
        bottom: pad,
        left: pad,
      })
      .png()
      .toFile(outFile);
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
