import snapshot from '../generated/catalog.json';
import images from '../generated/images.json';
import type { Product } from '../types/product';

export const catalogSnapshot = snapshot as Product[];
export const SITE_URL = 'https://viclu.store';
export const slugify = (value: string) => value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const categoryPath = (category: string) => `/coleccion/${slugify(category)}`;
export const productPath = (product: Product) => `/gorras/${slugify([product.name, product.description, product.color !== 'N/A' ? product.color : ''].filter(Boolean).join(' ')).slice(0, 80) || 'gorra'}-${product.id}`;
export const productName = (p: Product) => [p.name.trim(), p.description?.trim()].filter(Boolean).join(' · ');
export const getCategories = (products: Product[]) => Array.from(new Set(products.filter(p => p.active && p.stock > 0).map(p => p.category))).sort();

export const FAQS = [
  { question: '¿Cómo compro una gorra en VICLU.STORE?', answer: 'Elige un modelo y pulsa Consultar por WhatsApp. El mensaje incluye el producto y su precio. Confirma disponibilidad, forma de pago y entrega con la tienda antes de completar el pedido.' },
  { question: '¿Hacen envíos a toda Colombia?', answer: 'Coordinamos envíos dentro de Colombia por WhatsApp. Consulta el costo y el tiempo de entrega para tu ciudad antes de confirmar la compra.' },
  { question: '¿Qué tipos de gorras puedo encontrar?', answer: 'Explora nuestras colecciones de gorras beisboleras, camioneras, multimarca y Selección Colombia. Los modelos disponibles se muestran en el catálogo.' },
  { question: '¿Cómo elijo el ajuste y el modelo?', answer: 'Revisa las fotos y los detalles de la gorra. Escríbenos por WhatsApp para confirmar medidas, tipo de cierre y ajuste del modelo que te interesa.' },
];

interface ResponsiveImage { small: string; card: string; detail: string; }
const imageMap = images as Record<string, ResponsiveImage>;
export const productImage = (product: Product, size: 'card' | 'detail' = 'card') => product.image ? imageMap[product.image]?.[size] || product.image : undefined;
export const productSrcSet = (product: Product) => {
  const image = product.image && imageMap[product.image];
  return image ? `${image.small} 360w, ${image.card} 600w, ${image.detail} 900w` : undefined;
};
