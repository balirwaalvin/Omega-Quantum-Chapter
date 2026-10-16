import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const svg = fileURLToPath(new URL("../public/brand/omega-mark.svg", import.meta.url));
const iconsDir = fileURLToPath(new URL("../public/icons/", import.meta.url));
mkdirSync(iconsDir, { recursive: true });

for (const size of [192, 512]) {
  const out = fileURLToPath(new URL(`../public/icons/icon-${size}.png`, import.meta.url));
  const result = spawnSync(
    "magick",
    ["-background", "none", svg, "-resize", `${size}x${size}`, out],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error("ImageMagick failed to rasterize the Omega mark.");
    process.exit(result.status ?? 1);
  }
}

console.log("icons written");
