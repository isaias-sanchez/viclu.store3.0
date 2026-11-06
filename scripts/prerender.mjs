import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { getPages, render, SITE_URL, pageMetadata, structuredData } from '../.ssr/entry-server.js';

// Las dos fuentes de la primera pantalla se piden junto con el HTML: el texto no cambia de letra al cargar.
const assets = await readdir('dist/assets');
const fontPreloads = [/^bebas-neue-latin-400-normal.*\.woff2$/, /^inter-latin-wght-normal.*\.woff2$/]
  .map(pattern => assets.find(file => pattern.test(file)))
  .filter(Boolean)
  .map(file => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`)
  .join('\n');
const template = (await readFile('dist/index.html', 'utf8')).replace('<!-- font-preload -->', fontPreloads);
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const pages = getPages();
for (const page of pages) {
  const meta = pageMetadata(page.options);
  const json = JSON.stringify(structuredData(page.options)).replace(/</g, '\\u003c');
  const head = `<title>${escape(meta.title)}</title>
<meta name="description" content="${escape(meta.description)}" />
<meta name="robots" content="${meta.robots}" />
<link rel="canonical" href="${escape(meta.url)}" />
<meta property="og:type" content="${page.options.product ? 'product' : 'website'}" />
<meta property="og:title" content="${escape(meta.title)}" />
<meta property="og:description" content="${escape(meta.description)}" />
<meta property="og:url" content="${escape(meta.url)}" />
<meta property="og:image" content="${escape(meta.image)}" />
<meta property="og:image:alt" content="${escape(page.options.product?.name || 'VICLU.STORE, gorras de estilo urbano')}" />
<meta name="twitter:title" content="${escape(meta.title)}" />
<meta name="twitter:description" content="${escape(meta.description)}" />
<meta name="twitter:image" content="${escape(meta.image)}" />
<script id="page-jsonld" type="application/ld+json">${json}</script>`;
  const html = template.replace('<!-- page-head -->', head).replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${render(page.path)}</div>`);
  const filename = page.path === '/' ? 'dist/index.html' : `dist${page.path}.html`;
  await mkdir(filename.substring(0, filename.lastIndexOf('/')), { recursive: true });
  await writeFile(filename, html);
}
// Admin is always noindex in the HTTP response, even without executing JS.
await writeFile('dist/admin.html', template.replace('<!-- page-head -->', '<title>Admin | VICLU.STORE</title><meta name="robots" content="noindex, nofollow" />'));
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => !p.options.notFound).map(p => `  <url><loc>${escape(SITE_URL + p.path)}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Prerendered ${pages.length} public pages, admin shell and sitemap.`);
