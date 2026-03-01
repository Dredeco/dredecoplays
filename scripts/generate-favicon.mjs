import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const pngPath = join(publicDir, "favicon.png");
const icoPath = join(publicDir, "favicon.ico");

const sizes = [16, 32];
const pngBuffers = await Promise.all(
  sizes.map((size) =>
    sharp(pngPath).resize(size, size).png().toBuffer()
  )
);

const ico = await toIco(pngBuffers);
writeFileSync(icoPath, ico);
console.log("favicon.ico gerado em", icoPath);
