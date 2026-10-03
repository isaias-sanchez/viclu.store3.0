import { AnimatedNight } from './HalloweenArt';
import CampaignButton from './CampaignButton';
import { useMotionStage } from '../hooks/useMotionStage';

export default function Hero() {
  const ref = useMotionStage<HTMLElement>();
  return (
    <section className="campaign-hero motion-stage" ref={ref} aria-labelledby="campaign-title">
      <img className="campaign-image" src="/images/halloween-hero.webp" width="1536" height="1024" alt="" fetchPriority="high" />
      <div className="hero-shade" />
      <AnimatedNight />
      <div className="hero-inner site-container">
        <div className="campaign-copy">
          <p className="eyebrow"><span className="orange-dot" /> VICLU.STORE / ESPECIAL HALLOWEEN</p>
          <h1 id="campaign-title"><span className="headline-line headline-white">¿TRUCO O</span><br /><span className="headline-line">ESTILO?</span></h1>
          <p className="hero-tagline">PIEZAS REALES.<br />PARA HISTORIAS REALES.</p>
          <CampaignButton href="#catalogo" label="Ver colección" variant="light" />
        </div>
        <div className="hero-edition" aria-hidden="true"><span>OCTUBRE / 2026</span><span>LA CALLE COBRA VIDA</span></div>
      </div>
      <div className="hero-caption site-container"><span>GORRAS DE ESTILO URBANO · COLOMBIA</span><span>TU ESTILO. TUS REGLAS. ↘</span></div>
    </section>
  );
}
