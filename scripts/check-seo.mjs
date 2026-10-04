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
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `Single canonical: ${page.path}`);
  assert.ok(html.includes(`href="${SITE_URL + page.path}"`), `Self canonical: ${page.path}`);
  const store = schema['@graph'].find(item => item['@type'] === 'OnlineStore');
  assert.equal(store.name, 'VICLU.STORE');
  assert.ok(store.description.includes('online') && store.description.includes('no tenemos local'));
  assert.ok(store.areaServed.some(area => area['@type'] === 'City' && area.name === 'Barranquilla'));
  assert.ok(!store.address && !store.geo && !store.openingHours, 'Online store has no invented physical location');
  assert.ok(!schema['@graph'].some(item => item['@type'] === 'LocalBusiness'));
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
  if (!page.options.notFound) {
    const faq = schema['@graph'].find(item => item['@type'] === 'FAQPage');
    for (const question of faq.mainEntity) {
      assert.ok(html.includes(question.name), `FAQ question visible in HTML: ${page.path}`);
      assert.ok(html.includes(question.acceptedAnswer.text), `FAQ answer visible in HTML: ${page.path}`);
    }
    const list = schema['@graph'].find(item => item['@type'] === 'ItemList');
    if (list) for (const item of list.itemListElement) {
      assert.ok(paths.has(new URL(item.url).pathname), `ItemList target exists: ${item.url}`);
      assert.ok(html.includes(`href="${new URL(item.url).pathname}"`), `ItemList product is linked in HTML: ${page.path}`);
    }
  }
  if (page.options.editorial) {
    assert.ok(!title.includes('Halloween'), 'Editorial title stays evergreen');
    assert.ok(html.includes('Tienda exclusivamente online'), 'Online modality visible');
    assert.ok(html.includes('/envios-y-compras') && html.includes('/gorras-en-barranquilla') && html.includes('/guia-de-gorras'), 'Editorial pages linked together');
    if (page.options.editorial === 'barranquilla') {
      assert.ok(html.match(/<h1[\s\S]*?Barranquilla[\s\S]*?<\/h1>/i), 'Local topic in visible h1');
      assert.ok(html.includes('No tenemos local abierto al público'), 'Local landing clarifies online-only service');
    }
  }
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
