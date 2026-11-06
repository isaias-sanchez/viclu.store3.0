import { useEffect, useRef, useState } from 'react';
import type { VideoSources } from '../lib/videos';

interface NetworkInformation { saveData?: boolean; effectiveType?: string }

/** Con datos limitados, red lenta o movimiento reducido basta el póster. */
const canPlayVideo = () => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? '')) return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/** Espera a que la página termine de cargar para no competir con lo que se ve primero. */
const afterPageLoad = (start: () => void) => {
    let idle = 0;
    let timer = 0;
    const schedule = () => {
        if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(start, { timeout: 1500 });
        else timer = window.setTimeout(start, 200);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
        window.removeEventListener('load', schedule);
        if (idle) window.cancelIdleCallback(idle);
        if (timer) window.clearTimeout(timer);
    };
};

interface LoopVideoProps {
    video: VideoSources;
    /** La portada: su póster carga primero y el video entra al terminar la página. */
    priority?: boolean;
    sizes: string;
}

/**
 * Muestra el póster de inmediato y sólo descarga el video cuando hace falta:
 * cerca de la pantalla, y en pausa mientras no se ve.
 */
export default function LoopVideo({ video, priority = false, sizes }: LoopVideoProps) {
    const frameRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mounted, setMounted] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!canPlayVideo()) return;
        if (priority) return afterPageLoad(() => setMounted(true));
        const frame = frameRef.current;
        if (!frame || !('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setMounted(true);
                observer.disconnect();
            }
        }, { rootMargin: '300px 0px' });
        observer.observe(frame);
        return () => observer.disconnect();
    }, [priority]);

    useEffect(() => {
        const element = videoRef.current;
        const frame = frameRef.current;
        if (!mounted || !element || !frame) return;
        element.muted = true;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) element.play().catch(() => { /* el póster sigue visible */ });
            else element.pause();
        }, { threshold: 0.1 });
        observer.observe(frame);
        return () => observer.disconnect();
    }, [mounted]);

    return (
        <div ref={frameRef} className="absolute inset-0 bg-[#151515]">
            <img
                src={video.poster}
                srcSet={video.posterSet}
                sizes={sizes}
                width="1024"
                height="576"
                alt=""
                decoding="async"
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                className="absolute inset-0 w-full h-full object-cover"
            />
            {mounted && (
                <video
                    ref={videoRef}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    onPlaying={() => setReady(true)}
                >
                    <source src={video.small} type="video/webm" media="(max-width: 767px)" />
                    <source src={video.large} type="video/webm" />
                    <source src={video.mp4} type="video/mp4" />
                </video>
            )}
        </div>
    );
}
