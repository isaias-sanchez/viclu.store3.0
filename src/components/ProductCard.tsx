import type { Product } from '../types/product';
import { generateWhatsAppLink, formatPrice } from '../lib/utils';
import { MessageCircle, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productName, productPath, productImage, productSrcSet } from '../lib/catalog';

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const name = productName(product);
  const path = productPath(product);
  return (
    <article className="product-card group relative flex flex-col gap-3">
      {/* Contenedor de Imagen con Zoom */}
      <Link to={path} aria-label={`Ver ${name}`} className="block aspect-[4/5] bg-[#1A1A1A] overflow-hidden relative border border-white/5 group-hover:border-white/20 transition-colors duration-500">
        {/* Badge de Marca */}
        <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-widest uppercase bg-black/70 text-white px-2 py-1 border border-white/10">
          {product.brand.trim()}
        </span>

        {/* Imagen o Placeholder */}
        {product.image ? (
          <img
            src={productImage(product)}
            srcSet={productSrcSet(product)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt={`${name}, ${product.category}${product.color && product.color !== 'N/A' ? `, ${product.color.trim()}` : ''}`}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            width="600"
            height="750"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <span className="w-full h-full flex flex-col items-center justify-center text-white/10 group-hover:text-white/20 transition-colors">
            <ImageIcon strokeWidth={1} className="w-12 h-12 mb-2" aria-hidden="true" />
          </span>
        )}

        {/* Overlay Hover (Oscurecimiento sutil) */}
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </Link>

      {/* Información Minimalista */}
      <div className="flex justify-between items-start gap-3 pt-1 px-1">
        <div className="min-w-0">
          <h3 className="text-white font-medium text-lg leading-tight uppercase tracking-tight group-hover:text-[#E5E4E2] transition-colors">
            <Link to={path}>{product.name.trim()}</Link>
          </h3>
          <p className="text-xs text-gray-400 uppercase mt-1 tracking-wide">
            {product.category} • Stock: {product.stock}
          </p>
          {product.description && (
            <p className="text-xs text-brand-platinum/70 mt-2 line-clamp-2 max-w-[200px]">
              {product.description.trim()}
            </p>
          )}
        </div>
        <p className="text-[#E5E4E2] font-display text-xl tracking-wide whitespace-nowrap text-right">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Botón Acción */}
      <a
        href={generateWhatsAppLink(product)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Consultar ${name} por WhatsApp`}
        className="w-full mt-2 py-3 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#E5E4E2] hover:text-black hover:border-[#E5E4E2] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
      >
        <span>Consultar</span>
        <MessageCircle className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
      </a>
    </article>
  );
}
