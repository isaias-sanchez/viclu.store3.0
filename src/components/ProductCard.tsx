import type { Product } from '../types/product';
import { generateWhatsAppLink, formatPrice } from '../lib/utils';
import { MessageCircle, Image as ImageIcon } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const handleConsult = () => {
        const link = generateWhatsAppLink(product);
        window.open(link, '_blank');
    };

    return (
        <div className="group relative flex flex-col gap-3">
            {/* Contenedor de Imagen con Zoom */}
            <div className="aspect-[4/5] bg-[#1A1A1A] overflow-hidden relative cursor-pointer border border-white/5 group-hover:border-white/20 transition-colors duration-500">

                {/* Badge de Marca */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-black/50 backdrop-blur-sm text-white px-2 py-1 border border-white/10">
                        {product.brand}
                    </span>
                </div>

                {/* Imagen o Placeholder */}
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/10 group-hover:text-white/20 transition-colors">
                        <ImageIcon strokeWidth={1} className="w-12 h-12 mb-2" />
                    </div>
                )}

                {/* Overlay Hover (Oscurecimiento sutil) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>

            {/* Información Minimalista */}
            <div className="flex justify-between items-start pt-1 px-1">
                <div>
                    <h3 className="text-white font-medium text-lg leading-tight uppercase tracking-tight group-hover:text-[#E5E4E2] transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase mt-1 tracking-wide">
                        {product.category} • Stock: {product.stock}
                    </p>
                    {product.description && (
                        <p className="text-xs text-brand-platinum/60 mt-2 line-clamp-2 max-w-[200px]">
                            {product.description}
                        </p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-[#E5E4E2] font-display text-xl tracking-wide">
                        {formatPrice(product.price)}
                    </p>
                </div>
            </div>

            {/* Botón Acción (Aparece sutilmente o siempre visible pero estilizado) */}
            <button
                onClick={handleConsult}
                className="w-full mt-2 py-3 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#E5E4E2] hover:text-black hover:border-[#E5E4E2] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            >
                <span>Consultar</span>
                <MessageCircle className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
        </div>
    );
};

export default ProductCard;
