import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const repoRoot = process.cwd();
const svgPath = path.join(repoRoot, "public", "icons", "icon.svg");
const outDir = path.join(repoRoot, "public", "icons");

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function writePng(svgBuffer, size, outName) {
  const outPath = path.join(outDir, outName);
  await sharp(svgBuffer, { density: 384 })
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  return outPath;
}

async function main() {
  await ensureDir(outDir);
  const svg = await fs.readFile(svgPath);

  await writePng(svg, 180, "apple-touch-icon.png");
  await writePng(svg, 192, "icon-192.png");
  await writePng(svg, 512, "icon-512.png");
  await writePng(svg, 32, "favicon-32.png");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

