import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const svg = fileURLToPath(new URL("../public/brand/omega-mark.svg", import.meta.url));
const iconsDir = fileURLToPath(new URL("../public/icons/", import.meta.url));
mkdirSync(iconsDir, { recursive: true });

const targets = [
  { size: 192, out: "../public/icons/icon-192.png" },
  { size: 512, out: "../public/icons/icon-512.png" },
  { size: 512, out: "../public/brand/omega-mark-512.png" },
  { size: 1024, out: "../public/brand/omega-mark-1024.png" },
];

for (const { size, out } of targets) {
  const outPath = fileURLToPath(new URL(out, import.meta.url));
  const result = spawnSync(
    "magick",
    ["-density", "1200", "-background", "none", svg, "-resize", `${size}x${size}`, outPath],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error("ImageMagick failed to rasterize the Omega mark.");
    process.exit(result.status ?? 1);
  }
}

console.log("icons written");
