import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getPages, SITE_URL } from '../.ssr/entry-server.js';

const pages = getPages();
const paths = new Set(pages.map(p => p.path));
const titles = [];
for (const page of pages) {
  const html = await readFile(page.path === '/' ? 'dist/index.html' : `dist${page.path}.html`, 'utf8');
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `Exactly one h1: ${page.path}`);
  assert.ok(!html.includes('<!-- page-head -->'), `Metadata rendered: ${page.path}`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title, `Title: ${page.path}`);
  titles.push(title);
  assert.ok(html.includes('data-prerendered="true"'), `HTML before JS: ${page.path}`);
  assert.ok(html.includes('VICLU.STORE'), `Brand: ${page.path}`);
  const schema = JSON.parse(html.match(/<script id="page-jsonld" type="application\/ld\+json">(.*?)<\/script>/s)?.[1] || 'null');
  assert.equal(schema['@context'], 'https://schema.org');
  assert.ok(!html.includes('paymentAccepted'), 'Do not invent payment methods');
  for (const match of html.matchAll(/<a[^>]*href="(\/[^"#?]*)/g)) {
    assert.ok(paths.has(match[1]) || match[1] === '/admin', `Internal link exists: ${match[1]} from ${page.path}`);
  }
  if (page.options.product) {
    const product = schema['@graph'].find(item => item['@type'] === 'Product');
    assert.equal(product.offers.price, page.options.product.price, 'Unchanged inventory price');
    assert.equal(product.offers.priceCurrency, 'COP');
    assert.equal(product.offers.availability.endsWith('InStock'), page.options.product.stock > 0);
    assert.equal(product.url, SITE_URL + page.path);
    assert.ok(html.includes(`href="${SITE_URL + page.path}"`), 'Self canonical');
  }
  if (page.options.notFound) assert.ok(html.includes('noindex'));
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, pages.length - 1);
assert.ok(!sitemap.includes('/admin') && !sitemap.includes('/404'));
const admin = await readFile('dist/admin.html', 'utf8');
assert.ok(admin.includes('noindex, nofollow'));
const robots = await readFile('dist/robots.txt', 'utf8');
assert.ok(robots.includes('Disallow: /admin') && robots.includes(`${SITE_URL}/sitemap.xml`));
console.log(`SEO checks passed: ${pages.length - 1} indexable pages, product prices, schema, internal links, sitemap and admin noindex.`);
// Names can repeat in the source inventory; URLs remain unique through UUIDs.
assert.equal(paths.size, pages.length, 'Unique product URLs');
console.log(`Unique URLs: ${paths.size}. Titles: ${new Set(titles).size} distinct (inventory names may repeat).`);
