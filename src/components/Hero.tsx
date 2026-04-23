import { useEffect, useRef, useState } from 'react';

export const Hero = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoReady, setVideoReady] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleCanPlay = () => setVideoReady(true);
        video.addEventListener('canplay', handleCanPlay);

        // autoplay silencioso (requerido por browsers móviles)
        video.play().catch(() => {
            // Si autoplay falla, el poster sigue visible
        });

        return () => video.removeEventListener('canplay', handleCanPlay);
    }, []);

    return (
        <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
            {/* Video de fondo */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/viclu-icon.png"
                    aria-hidden="true"
                >
                    <source src="/videos/hero.webm" type="video/webm" />
                </video>
                {/* Fallback mientras carga */}
                {!videoReady && (
                    <div className="w-full h-full bg-[#151515] animate-pulse" />
                )}
            </div>

            {/* Overlay degradado para legibilidad del texto */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-[#0F0F0F]/60 to-[#0F0F0F] pointer-events-none" />

            {/* Contenido Editorial */}
            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                <span className="block text-[#E5E4E2] text-sm md:text-base tracking-[0.3em] uppercase mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
                    Estilo Urbano Premium
                </span>

                <h1 className="text-7xl md:text-9xl font-display uppercase leading-[0.9] tracking-tighter mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Viclu <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-[#E5E4E2] to-gray-500">Store</span>
                </h1>

                <p className="text-gray-300 font-light text-lg md:text-xl max-w-xl mx-auto mb-10 fade-in-up" style={{ animationDelay: '0.3s' }}>
                    La colección definitiva de Gorras. Diseñada para destacar en las calles.
                </p>

                <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <a
                        href="#catalogo"
                        className="inline-block px-10 py-4 bg-[#E5E4E2] text-black font-bold uppercase tracking-wider text-sm hover:bg-white hover:scale-105 transition-all duration-300"
                    >
                        Ver Colección
                    </a>
                </div>
            </div>

            {/* Indicador de scroll */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                    <div className="w-1 h-2 bg-white/60 rounded-full" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
