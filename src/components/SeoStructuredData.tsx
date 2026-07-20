import { useEffect } from 'react';
import type { Product } from '../types/product';

/**
 * Inyecta datos estructurados JSON-LD (ItemList de Product) en el <head>
 * a partir de los productos cargados desde Supabase.
 *
 * Los crawlers que ejecutan JavaScript (Googlebot) leen este bloque y pueden
 * mostrar resultados enriquecidos de producto. Refuerza además el SEO/GEO al
 * exponer el inventario real de forma legible por máquinas.
 */
const SCRIPT_ID = 'seo-products-jsonld';

interface Props {
    products: Product[];
}

export const SeoStructuredData = ({ products }: Props) => {
    useEffect(() => {
        const visibles = products.filter((p) => p.active && p.stock > 0);
        if (visibles.length === 0) return;

        // Limitar para no inflar el DOM; los primeros modelos disponibles bastan.
        const items = visibles.slice(0, 50).map((p, index) => {
            const nombre = p.category ? `${p.name} — ${p.category}` : p.name;
            const offer: Record<string, unknown> = {
                '@type': 'Offer',
                priceCurrency: 'COP',
                price: p.price,
                availability: 'https://schema.org/InStock',
                url: 'https://viclu.store/',
            };
            const product: Record<string, unknown> = {
                '@type': 'Product',
                name: nombre.trim(),
                category: p.category || 'Gorras',
                brand: { '@type': 'Brand', name: p.brand || 'Viclu' },
                offers: offer,
            };
            if (p.description) product.description = p.description;
            if (p.color && p.color !== 'N/A') product.color = p.color;
            if (p.image) product.image = p.image;

            return {
                '@type': 'ListItem',
                position: index + 1,
                item: product,
            };
        });

        const jsonld = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Catálogo de gorras — Viclu Store',
            numberOfItems: visibles.length,
            itemListElement: items,
        };

        let el = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (!el) {
            el = document.createElement('script');
            el.id = SCRIPT_ID;
            el.type = 'application/ld+json';
            document.head.appendChild(el);
        }
        el.textContent = JSON.stringify(jsonld);

        return () => {
            document.getElementById(SCRIPT_ID)?.remove();
        };
    }, [products]);

    return null;
};

export default SeoStructuredData;
