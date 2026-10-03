import { loadEnv } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';

// Only public catalog columns and the public Supabase key are used. Fail the
// build on unavailable inventory rather than publishing invented stock/prices.
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before building.');
}
const products = [];
for (let offset = 0; ; offset += 1000) {
  const url = new URL('/rest/v1/products', env.VITE_SUPABASE_URL);
  url.searchParams.set('select', 'id,name,brand,price,category,stock,description,color,active,image');
  url.searchParams.set('active', 'eq.true');
  url.searchParams.set('order', 'created_at.desc,id.asc');
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', '1000');
  const response = await fetch(url, {
    headers: { apikey: env.VITE_SUPABASE_ANON_KEY },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Catalog request failed (${response.status}).`);
  const page = await response.json();
  if (!Array.isArray(page)) throw new Error('Invalid catalog response.');
  for (const p of page) {
    if (!p.id || !p.name || !Number.isFinite(p.price) || p.price < 0 || !Number.isFinite(p.stock)) {
      throw new Error('Invalid product data. Fix the inventory before publishing.');
    }
  }
  products.push(...page);
  if (page.length < 1000) break;
}
await mkdir('src/generated', { recursive: true });
await writeFile('src/generated/catalog.json', JSON.stringify(products));
console.log(`Public catalog snapshot: ${products.length} active products.`);
