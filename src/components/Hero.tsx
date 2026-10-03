import { ArrowDownRight } from 'lucide-react';
import { AnimatedNight } from './HalloweenArt';

export default function Hero() {
  return (
    <section className="campaign-hero" aria-labelledby="campaign-title">
      <img className="campaign-image" src="/images/halloween-hero.webp" width="1536" height="1024" alt="" fetchPriority="high" />
      <div className="hero-shade" />
      <AnimatedNight />
      <div className="hero-inner site-container">
        <div className="campaign-copy">
          <p className="eyebrow"><span className="orange-dot" /> VICLU.STORE / ESPECIAL HALLOWEEN</p>
          <h1 id="campaign-title">¿TRUCO O<br /><span>ESTILO?</span></h1>
          <p className="hero-tagline">PIEZAS REALES.<br />PARA HISTORIAS REALES.</p>
          <a className="button button-light" href="#catalogo">Ver colección <ArrowDownRight size={17} /></a>
        </div>
        <div className="hero-edition" aria-hidden="true"><span>OCTUBRE / 2026</span><span>LA CALLE COBRA VIDA</span></div>
      </div>
      <div className="hero-caption site-container"><span>GORRAS DE ESTILO URBANO · COLOMBIA</span><span>TU ESTILO. TUS REGLAS. ↘</span></div>
    </section>
  );
}
