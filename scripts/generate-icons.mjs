import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const name = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}

function png(size) {
  const row = size * 4 + 1;
  const raw = Buffer.alloc(row * size);
  const blue = [0x00, 0x30, 0x87];
  const gold = [0xf1, 0xc4, 0x0f];
  const green = [0x1b, 0x5e, 0x20];
  const magenta = [0xc2, 0x18, 0x5b];
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const radius = size * 0.32;
  for (let y = 0; y < size; y++) {
    const start = y * row;
    raw[start] = 0;
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      let color = blue;
      if (Math.abs(dist - radius) < size * 0.025) color = gold;
      else if (dist < size * 0.03) color = green;
      else if (Math.abs(dx) < size * 0.012 && dy < 0 && dy > -radius) color = magenta;
      const offset = start + 1 + x * 4;
      raw[offset] = color[0];
      raw[offset + 1] = color[1];
      raw[offset + 2] = color[2];
      raw[offset + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(new URL("../public/icons/", import.meta.url), { recursive: true });
writeFileSync(new URL("../public/icons/icon-192.png", import.meta.url), png(192));
writeFileSync(new URL("../public/icons/icon-512.png", import.meta.url), png(512));
console.log("icons written");
