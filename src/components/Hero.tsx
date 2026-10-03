import { ArrowDownRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="campaign-hero" aria-labelledby="campaign-title">
      <img className="campaign-image" src="/images/halloween-hero.webp" width="1536" height="1024" alt="" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="hero-inner site-container">
        <div className="campaign-copy">
          <p className="eyebrow"><span className="orange-dot" /> VICLU.STORE / HALLOWEEN EDIT</p>
          <h1 id="campaign-title">TRICK OR<br /><span>STYLE?</span></h1>
          <p className="hero-tagline">PIEZAS REALES.<br />PARA HISTORIAS REALES.</p>
          <a className="button button-light" href="#catalogo">Ver colección <ArrowDownRight size={17} /></a>
        </div>
        <div className="hero-edition" aria-hidden="true"><span>OCTUBRE / 2026</span><span>THE STREETS AFTER DARK</span></div>
      </div>
      <div className="hero-caption site-container"><span>GORRAS DE ESTILO URBANO · COLOMBIA</span><span>TU ESTILO. TUS REGLAS. ↘</span></div>
    </section>
  );
}
