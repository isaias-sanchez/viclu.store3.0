/**
 * Videos servidos desde el CDN del sitio (/public/videos), no desde Supabase:
 * así no dependen de que la base esté activa ni de un token con vencimiento.
 * Cada uno tiene versión grande, versión móvil, MP4 para iPhone antiguos y póster.
 */
export interface VideoSources {
    large: string;
    small: string;
    mp4: string;
    poster: string;
    posterSet: string;
}

const video = (name: string, largeHeight: number, smallHeight: number): VideoSources => ({
    large: `/videos/${name}-${largeHeight}.webm`,
    small: `/videos/${name}-${smallHeight}.webm`,
    mp4: `/videos/${name}-480.mp4`,
    poster: `/videos/${name}-poster-1024.webp`,
    posterSet: `/videos/${name}-poster-640.webp 640w, /videos/${name}-poster-1024.webp 1024w`,
});

export const VIDEOS = {
    hero: video('hero', 720, 480),
    /** Showcase 1 — "Hecho para la Ciudad" (lifestyle urbano) */
    lifestyle: video('lifestyle', 576, 360),
    /** Showcase 2 — "Que Hablen las Imágenes" (editorial / cinematográfico) */
    editorial: video('editorial', 576, 360),
    /** Showcase 3 — "Calidad que se Ve" (producto en estudio) */
    producto: video('producto', 576, 360),
    /** Showcase 4 — "Una para Cada Día" (variedad de estilos) */
    variedad: video('variedad', 576, 360),
};
