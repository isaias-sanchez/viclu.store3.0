import type { Product } from '../types/product';
import { APP_CONFIG, WHATSAPP_PHONE } from './constants';
import { FAQS, SITE_URL, categoryPath, productName, productPath } from './catalog';

export interface SeoOptions { category?: string; product?: Product; notFound?: boolean; }
export function pageMetadata({ category, product, notFound }: SeoOptions = {}) {
  const path = product ? productPath(product) : category ? categoryPath(category) : '/';
  return {
    url: `${SITE_URL}${path}`,
    title: notFound ? 'Página no encontrada | VICLU.STORE' : product ? `${productName(product)} | VICLU.STORE Colombia` : category ? `Gorras ${category} en Colombia | VICLU.STORE` : 'VICLU.STORE | Gorras urbanas en Colombia · Halloween Edit',
    description: product ? `${productName(product)} de la colección ${product.category}. Consulta disponibilidad, ajuste y precio por WhatsApp en VICLU.STORE. Envíos dentro de Colombia.` : category ? `Descubre gorras ${category} en VICLU.STORE. Fotos y precios del catálogo real, atención por WhatsApp y envíos dentro de Colombia.` : 'Gorras beisboleras, camioneras, multimarca y Selección Colombia. Encuentra tu estilo en VICLU.STORE y consulta por WhatsApp. Envíos en Colombia.',
    image: product?.image?.startsWith('https://') ? product.image : `${SITE_URL}/images/halloween-hero.webp`,
    robots: notFound ? 'noindex, follow' : 'index, follow, max-image-preview:large',
  };
}

export function structuredData(options: SeoOptions = {}) {
  const meta = pageMetadata(options);
  const store = { '@type': 'OnlineStore', '@id': `${SITE_URL}/#store`, name: 'VICLU.STORE', url: `${SITE_URL}/`, logo: `${SITE_URL}/viclu-icon.png`, description: 'Tienda de gorras de estilo urbano en Colombia. Consulta y pedidos por WhatsApp.', areaServed: { '@type': 'Country', name: 'Colombia' }, contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: `+${WHATSAPP_PHONE}`, availableLanguage: 'es' }, sameAs: [APP_CONFIG.instagramUrl] };
  const graph: object[] = [store, { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'VICLU.STORE', inLanguage: 'es-CO', publisher: { '@id': `${SITE_URL}/#store` } }, { '@type': options.category ? 'CollectionPage' : 'WebPage', '@id': meta.url, url: meta.url, name: meta.title, description: meta.description, inLanguage: 'es-CO', isPartOf: { '@id': `${SITE_URL}/#website` } }];
  if (options.product) {
    const p = options.product;
    graph.push({ '@type': 'Product', '@id': `${meta.url}#product`, name: productName(p), description: `${productName(p)}. Colección ${p.category}. Consulta ajuste y disponibilidad por WhatsApp.`, ...(p.image?.startsWith('https://') ? { image: [p.image] } : {}), sku: p.id, url: meta.url, category: p.category, brand: { '@type': 'Brand', name: p.brand.trim() }, ...(p.color && p.color.trim() !== 'N/A' ? { color: p.color.trim() } : {}), offers: { '@type': 'Offer', url: meta.url, price: p.price, priceCurrency: 'COP', availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@id': `${SITE_URL}/#store` } } });
  }
  if (!options.notFound) {
    graph.push({ '@type': 'FAQPage', '@id': `${meta.url}#preguntas`, mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) });
    if (options.product || options.category) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'VICLU.STORE', item: `${SITE_URL}/` }, { '@type': 'ListItem', position: 2, name: options.product?.category || options.category, item: `${SITE_URL}${categoryPath(options.product?.category || options.category!)}` }, ...(options.product ? [{ '@type': 'ListItem', position: 3, name: productName(options.product), item: meta.url }] : [])] });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
