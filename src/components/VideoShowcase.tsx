import { useEffect, useRef, useState } from 'react';

type Align = 'left' | 'right';

interface VideoShowcaseProps {
    src: string;
    eyebrow?: string;
    title: string;
    description: string;
    ctaHref?: string;
    ctaLabel?: string;
    align?: Align;
}

/**
 * Sección narrativa con video que se reproduce sólo cuando entra en viewport.
 * Alterna texto ↔ video (left/right) para dar ritmo visual al scroll.
 */
export const VideoShowcase = ({
    src,
    eyebrow,
    title,
    description,
    ctaHref,
    ctaLabel,
    align = 'left',
}: VideoShowcaseProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);

    // Intersection Observer: play cuando el video entra en viewport, pause cuando sale
    useEffect(() => {
        const section = sectionRef.current;
        const video = videoRef.current;
        if (!section || !video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            },
            { threshold: 0.25 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const isRight = align === 'right';

    return (
        <section
            ref={sectionRef}
            className="relative py-24 md:py-32 overflow-hidden"
        >
            <div className="container mx-auto px-4">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${isRight ? 'md:[&>*:first-child]:order-2' : ''}`}>
                    {/* Video */}
                    <div
                        className={`relative aspect-[4/5] md:aspect-square rounded-sm overflow-hidden border border-white/10 bg-[#151515] transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-hidden="true"
                        >
                            <source src={src} type="video/webm" />
                        </video>
                        {/* Vignette sutil */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Texto */}
                    <div
                        className={`transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                    >
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
