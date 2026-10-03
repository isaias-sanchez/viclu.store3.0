import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import sharp from 'sharp';

const products = JSON.parse(await readFile('src/generated/catalog.json', 'utf8'));
const images = {};
await mkdir('public/images/products', { recursive: true });
let downloadedBytes = 0;
let outputBytes = 0;
const pending = products.filter(p => p.image?.startsWith('https://'));
async function worker() {
  while (pending.length) {
    const product = pending.shift();
    const hash = createHash('sha256').update(product.image).digest('hex').slice(0, 12);
    const path = `/images/products/${hash}`;
    try {
      try { await access(`public${path}-900.webp`); }
      catch {
        const response = await fetch(product.image, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        downloadedBytes += buffer.length;
        await Promise.all([360, 600, 900].map(async width => {
          const result = await sharp(buffer).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public${path}-${width}.webp`);
          outputBytes += result.size;
        }));
      }
      images[product.image] = { small: `${path}-360.webp`, card: `${path}-600.webp`, detail: `${path}-900.webp` };
    } catch {
      // Keep the genuine original if optional optimization cannot complete.
      console.warn(`Image optimization skipped for product ${product.id}; original retained.`);
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
await writeFile('src/generated/images.json', JSON.stringify(images));
console.log(`Optimized ${Object.keys(images).length} product images. Downloaded ${(downloadedBytes / 1e6).toFixed(1)} MB; new responsive assets ${(outputBytes / 1e6).toFixed(1)} MB.`);
