import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const outputPath = join(publicDir, "og-default.png");

// Cria imagem 1200x630 com fundo escuro (tema do site)
// Logo centralizado a partir do favicon redimensionado
const faviconPath = join(publicDir, "favicon.png");
const logo = await sharp(faviconPath).resize(400, 400).png().toBuffer();

const width = 1200;
const height = 630;

// SVG com fundo gradiente escuro e área para o logo
const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f"/>
      <stop offset="100%" style="stop-color:#1a1a2e"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="50%" y="85%" text-anchor="middle" fill="#6366f1" font-family="system-ui,sans-serif" font-size="48" font-weight="bold">Dredeco Plays</text>
  <text x="50%" y="95%" text-anchor="middle" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="24">Portal de Games</text>
</svg>
`;

const svgBuffer = Buffer.from(svg);
const background = await sharp(svgBuffer).png().toBuffer();

const logoResized = await sharp(logo)
  .resize(280, 280)
  .png()
  .toBuffer();

const result = await sharp(background)
  .composite([
    {
      input: logoResized,
      left: Math.round((width - 280) / 2),
      top: 140,
    },
  ])
  .png()
  .toBuffer();

writeFileSync(outputPath, result);
console.log("og-default.png gerado em", outputPath);
