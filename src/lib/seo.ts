import type { Product } from '../types/product';
import { APP_CONFIG, WHATSAPP_PHONE } from './constants';
import { FAQS, SITE_URL, catalogSnapshot, categoryPath, getCategories, productName, productPath } from './catalog';
import { EDITORIAL_PAGES, STORE_DESCRIPTION, type EditorialPage } from './editorial';

export interface SeoOptions { category?: string; product?: Product; notFound?: boolean; editorial?: EditorialPage; }
const productLabel = (p: Product) => [productName(p), p.brand.trim(), p.color?.trim() && p.color.trim() !== 'N/A' ? p.color.trim() : ''].filter(Boolean).join(' · ');

export function pageMetadata({ category, product, notFound, editorial }: SeoOptions = {}) {
  const content = editorial ? EDITORIAL_PAGES[editorial] : undefined;
  const path = notFound ? '/404' : content ? content.path : product ? productPath(product) : category ? categoryPath(category) : '/';
  return {
    url: `${SITE_URL}${path}`,
    title: notFound ? 'Página no encontrada | VICLU.STORE' : content ? content.title : product ? `${productLabel(product)} | VICLU.STORE` : category ? `Gorras ${category}: catálogo online | VICLU.STORE` : 'Gorras online en Colombia y Barranquilla | VICLU.STORE',
    description: content ? content.description : product ? `${productLabel(product)}. Colección ${product.category} de VICLU.STORE. Consulta precio, disponibilidad y ajuste por WhatsApp. Envíos en Colombia.` : category ? `Explora gorras ${category} en VICLU.STORE: fotos y precios del catálogo, pedidos por WhatsApp y envíos a Barranquilla y otras ciudades de Colombia.` : 'VICLU.STORE, tienda online de gorras beisboleras, camioneras, multimarca y Selección Colombia. Pedidos por WhatsApp y envíos a Barranquilla y Colombia.',
    image: product?.image?.startsWith('https://') ? product.image : `${SITE_URL}/images/halloween-hero.webp`,
    robots: notFound ? 'noindex, follow' : 'index, follow, max-image-preview:large',
  };
}

export function structuredData(options: SeoOptions = {}) {
  const meta = pageMetadata(options);
  const storeId = `${SITE_URL}/#store`;
  const websiteId = `${SITE_URL}/#website`;
  const content = options.editorial ? EDITORIAL_PAGES[options.editorial] : undefined;
  const store = {
    '@type': 'OnlineStore', '@id': storeId, name: 'VICLU.STORE', alternateName: 'Viclu Store', url: `${SITE_URL}/`,
    logo: `${SITE_URL}/viclu-icon.png`, description: STORE_DESCRIPTION, telephone: `+${WHATSAPP_PHONE}`,
    areaServed: [{ '@type': 'Country', name: 'Colombia' }, { '@type': 'City', name: 'Barranquilla', containedInPlace: { '@type': 'Country', name: 'Colombia' } }],
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: `+${WHATSAPP_PHONE}`, availableLanguage: 'es' }, sameAs: [APP_CONFIG.instagramUrl],
  };
  const graph: object[] = [store,
    { '@type': 'WebSite', '@id': websiteId, url: `${SITE_URL}/`, name: 'VICLU.STORE', alternateName: 'Viclu Store', inLanguage: 'es-CO', publisher: { '@id': storeId } },
    { '@type': options.category ? 'CollectionPage' : options.editorial === 'compras' ? 'AboutPage' : 'WebPage', '@id': meta.url, url: meta.url, name: meta.title, description: meta.description, inLanguage: 'es-CO', isPartOf: { '@id': websiteId }, about: { '@id': storeId }, ...(options.product ? { mainEntity: { '@id': `${meta.url}#product` } } : {} ) },
  ];
  if (options.product) {
    const p = options.product;
    graph.push({ '@type': 'Product', '@id': `${meta.url}#product`, name: productLabel(p), description: `${productLabel(p)}. Colección ${p.category}. Consulta ajuste y disponibilidad por WhatsApp.`, ...(p.image?.startsWith('https://') ? { image: [p.image] } : {}), sku: p.id, url: meta.url, category: p.category, ...(p.brand.trim() ? { brand: { '@type': 'Brand', name: p.brand.trim() } } : {}), ...(p.color && p.color.trim() !== 'N/A' ? { color: p.color.trim() } : {}), offers: { '@type': 'Offer', url: meta.url, price: p.price, priceCurrency: 'COP', availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@id': storeId } } });
  }
  if (!options.product && !options.notFound && options.editorial !== 'compras') {
    const available = catalogSnapshot.filter(p => p.active && p.stock > 0);
    const listed = options.editorial ? getCategories(available).flatMap(category => available.filter(p => p.category === category).slice(0, 1)) : available.filter(p => !options.category || p.category === options.category);
    graph.push({ '@type': 'ItemList', '@id': `${meta.url}#catalogo`, name: options.category ? `Gorras ${options.category}` : 'Catálogo VICLU.STORE', numberOfItems: listed.length, itemListElement: listed.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: productLabel(p), url: `${SITE_URL}${productPath(p)}` })) });
  }
  if (!options.notFound) {
    graph.push({ '@type': 'FAQPage', '@id': `${meta.url}#preguntas`, mainEntity: (content?.questions || FAQS).map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) });
    if (options.product || options.category || content) graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'VICLU.STORE', item: `${SITE_URL}/` },
      ...(content ? [{ '@type': 'ListItem', position: 2, name: content.title.split(' | ')[0], item: meta.url }] : [
        { '@type': 'ListItem', position: 2, name: options.product?.category || options.category, item: `${SITE_URL}${categoryPath(options.product?.category || options.category!)}` },
        ...(options.product ? [{ '@type': 'ListItem', position: 3, name: productName(options.product), item: meta.url }] : []),
      ]),
    ] });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
