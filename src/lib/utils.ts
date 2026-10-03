import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WHATSAPP_PHONE } from './constants';
import { productName } from './catalog';
import type { Product } from '../types/product';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

export function generateWhatsAppLink(product: Product) {
    const lines = [`Hola, estoy interesado en: ${productName(product)} - ${formatPrice(product.price)} COP`];

    const detalles: string[] = [];
    if (product.category) detalles.push(`Categoría: ${product.category}`);
    if (product.color && product.color !== 'N/A') detalles.push(`Color: ${product.color}`);
    if (detalles.length > 0) lines.push(detalles.join(' • '));

    // WhatsApp no permite adjuntar archivos vía wa.me, pero al incluir la URL
    // pública de la imagen el chat muestra la foto como vista previa del link.
    if (product.image && product.image.startsWith('http')) {
        lines.push('', `📷 Foto del modelo: ${product.image}`);
    }

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Convierte un archivo de imagen a cadena Base64
 * para almacenamiento local.
 */
export const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};
