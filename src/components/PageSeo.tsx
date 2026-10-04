import { useEffect } from 'react';
import { pageMetadata, structuredData, type SeoOptions } from '../lib/seo';

export default function PageSeo({ category, product, notFound, editorial }: SeoOptions) {
  useEffect(() => {
    const options = { category, product, notFound, editorial };
    const meta = pageMetadata(options);
    document.title = meta.title;
    for (const [name, content] of Object.entries({ description: meta.description, robots: meta.robots, 'og:type': product ? 'product' : 'website', 'og:title': meta.title, 'og:description': meta.description, 'og:url': meta.url, 'og:image': meta.image, 'og:image:alt': product?.name || 'VICLU.STORE Especial Halloween', 'twitter:title': meta.title, 'twitter:description': meta.description, 'twitter:image': meta.image })) {
      const attr = name.startsWith('og:') ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attr, name); document.head.appendChild(element); }
      element.setAttribute('content', content);
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', meta.url);
    let script = document.getElementById('page-jsonld');
    if (!script) { script = document.createElement('script'); script.id = 'page-jsonld'; script.setAttribute('type', 'application/ld+json'); document.head.appendChild(script); }
    script.textContent = JSON.stringify(structuredData(options));
  }, [category, product, notFound, editorial]);
  return null;
}
