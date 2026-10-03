import type { Product } from '../types/product';
import { generateWhatsAppLink, formatPrice } from '../lib/utils';
import { MessageCircle, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productName, productPath, productImage, productSrcSet } from '../lib/catalog';

export default function ProductCard({ product }: { product: Product }) {
  const name = productName(product);
  return (
    <article className="product-card">
      <Link className="product-image-link" to={productPath(product)} aria-label={`Ver ${name}`}>
        {product.image ? <img src={productImage(product)} srcSet={productSrcSet(product)} sizes="(max-width: 580px) 46vw, (max-width: 800px) 30vw, 290px" alt={`${name}, ${product.category}${product.color && product.color !== 'N/A' ? `, ${product.color.trim()}` : ''}`} loading="lazy" decoding="async" width="600" height="600" /> : <ImageIcon size={40} aria-hidden="true" />}
        <span className="product-brand">{product.brand.trim()}</span><span className="product-view"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="product-info"><h3><Link to={productPath(product)}>{name}</Link></h3><p>{product.category}</p><strong>{formatPrice(product.price)} <span>COP</span></strong></div>
      <a className="button button-outline product-consult" href={generateWhatsAppLink(product)} target="_blank" rel="noopener noreferrer" aria-label={`Consultar ${name} por WhatsApp`}>Consultar <MessageCircle size={14} /></a>
    </article>
  );
}
