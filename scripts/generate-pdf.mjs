import { writeFileSync, mkdirSync } from "node:fs";

const lines = [
  "BT /F1 20 Tf 72 740 Td (Omega) Tj ET",
  "BT /F1 12 Tf 72 710 Td (Quantum sensing brief) Tj ET",
  "BT /F1 12 Tf 72 680 Td (Uganda Christian University) Tj ET",
  "BT /F1 12 Tf 72 650 Td (Quantum Computing Chapter) Tj ET",
  "BT /F1 11 Tf 72 610 Td (Sensing uses quantum phase to notice a small change.) Tj ET",
  "BT /F1 11 Tf 72 590 Td (This note is a handout, not a device manual.) Tj ET",
  "BT /F1 11 Tf 72 540 Td (Alpha and Omega: God the Beginning and the End) Tj ET",
];
const stream = lines.join("\n");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Count 1 /Kids [3 0 R] >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
];

let body = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((object, index) => {
  offsets.push(Buffer.byteLength(body));
  body += `${index + 1} 0 obj\n${object}\nendobj\n`;
});
const xref = Buffer.byteLength(body);
body += `xref\n0 ${objects.length + 1}\n`;
body += "0000000000 65535 f \n";
for (let i = 1; i < offsets.length; i++) {
  body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}
body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

mkdirSync(new URL("../public/resources/", import.meta.url), { recursive: true });
writeFileSync(new URL("../public/resources/quantum-sensing-brief.pdf", import.meta.url), body);
console.log("pdf written");
