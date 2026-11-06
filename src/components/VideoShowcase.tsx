import { useEffect, useRef, useState } from 'react';
import LoopVideo from './LoopVideo';
import type { VideoSources } from '../lib/videos';

type Align = 'left' | 'right';

interface VideoShowcaseProps {
    video: VideoSources;
    eyebrow?: string;
    title: string;
    description: string;
    ctaHref?: string;
    ctaLabel?: string;
    align?: Align;
}

/**
 * Sección narrativa con video. Alterna texto ↔ video (left/right) para dar
 * ritmo visual al scroll; el video se descarga y reproduce desde LoopVideo.
 */
export const VideoShowcase = ({
    video,
    eyebrow,
    title,
    description,
    ctaHref,
    ctaLabel,
    align = 'left',
}: VideoShowcaseProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    // Empieza el fade-in 400px ANTES de entrar al viewport para que en scroll
    // rápido la sección no aparezca vacía
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect(); // una sola vez
                }
            },
            { threshold: 0, rootMargin: '0px 0px 400px 0px' }
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const isRight = align === 'right';

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${isRight ? 'md:[&>*:first-child]:order-2' : ''}`}>
                    {/* Video */}
                    <div className={`relative aspect-[4/5] md:aspect-square rounded-sm overflow-hidden border border-white/10 bg-[#151515] transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <LoopVideo video={video} sizes="(min-width: 768px) 50vw, 100vw" />
                        {/* Vignette sutil */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Texto */}
                    <div className={`transition-all duration-500 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {eyebrow && (
                            <span className="block text-[#E5E4E2] text-xs md:text-sm tracking-[0.3em] uppercase mb-4">
                                {eyebrow}
                            </span>
                        )}
                        <h2 className="text-4xl md:text-6xl font-display uppercase leading-[0.95] tracking-tight mb-6 text-[#E5E4E2]">
                            {title}
                        </h2>
                        <p className="text-gray-400 font-light text-base md:text-lg leading-relaxed max-w-md mb-8">
                            {description}
                        </p>
                        {ctaHref && ctaLabel && (
                            <a
                                href={ctaHref}
                                className="inline-block px-8 py-3 border border-[#E5E4E2] text-[#E5E4E2] font-bold uppercase tracking-wider text-xs hover:bg-[#E5E4E2] hover:text-black transition-all duration-300"
                            >
                                {ctaLabel}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoShowcase;
