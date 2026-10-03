import type { CSSProperties, PointerEvent } from 'react';
import { HalloweenMark, HangingSpider, WebCorner } from './HalloweenArt';
import CampaignButton from './CampaignButton';
import { useMotionStage } from '../hooks/useMotionStage';
import './Hero.css';

/** An editorial scene built in layers, rather than text over a background photo. */
export default function Hero() {
  const ref = useMotionStage<HTMLElement>();
  const followPointer = (event: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    event.currentTarget.style.setProperty('--scene-x', `${x * 32}px`);
    event.currentTarget.style.setProperty('--scene-y', `${y * 24}px`);
    event.currentTarget.style.setProperty('--scene-turn', `${x * 8}deg`);
  };
  const resetPointer = () => {
    ref.current?.style.setProperty('--scene-x', '0px');
    ref.current?.style.setProperty('--scene-y', '0px');
    ref.current?.style.setProperty('--scene-turn', '0deg');
  };
  return (
    <section className="campaign-hero eclipse-hero motion-stage" ref={ref} onPointerMove={followPointer} onPointerLeave={resetPointer} aria-labelledby="campaign-title">
      <div className="eclipse-grain" aria-hidden="true" />
      <div className="eclipse-topline site-container"><p>VICLU.STORE / ESPECIAL HALLOWEEN</p><span>COLOMBIA · OCTUBRE 2026</span></div>
      <h1 id="campaign-title" className="eclipse-title"><span className="eclipse-question">¿TRUCO O </span><span className="eclipse-word">ESTILO?</span></h1>
      <div className="eclipse-scene" aria-hidden="true">
        <div className="eclipse-aura" />
        <div className="eclipse-portal">
          <svg viewBox="0 0 600 600" fill="none" className="eclipse-traces">
            <circle cx="300" cy="300" r="253" className="eclipse-ring" />
            <circle cx="300" cy="300" r="274" className="eclipse-dashes" />
            <circle cx="300" cy="300" r="233" className="eclipse-inner-ring" />
            <g className="eclipse-web-strands">
              {Array.from({ length: 12 }, (_, i) => <path key={i} d="M300 300L300 47" transform={`rotate(${i * 30} 300 300)`} />)}
              {[120, 180, 220].map(radius => <circle key={radius} cx="300" cy="300" r={radius} />)}
            </g>
            <path className="eclipse-comet" d="M47 300a253 253 0 0 1 253-253" />
          </svg>
        </div>
        <div className="eclipse-product-drift"><div className="eclipse-product"><img src="/images/halloween-cap-eclipse.webp" width="1000" height="1000" alt="" fetchPriority="high" draggable={false} /></div></div>
        <div className="eclipse-shadow" />
        {Array.from({ length: 8 }, (_, i) => <i className="eclipse-cinder" key={i} style={{ '--cinder-x': `${20 + i * 9}%`, '--cinder-delay': `${-i * .9}s`, '--cinder-travel': `${(i % 2 ? -1 : 1) * (30 + i * 8)}px` } as CSSProperties} />)}
      </div>
      <div className="eclipse-haunt" aria-hidden="true"><WebCorner className="eclipse-corner" /><HangingSpider className="eclipse-spider" /><HalloweenMark kind="bat" className="eclipse-bat bat-near" /><HalloweenMark kind="bat" className="eclipse-bat bat-far" /></div>
      <div className="eclipse-side-label" aria-hidden="true">LA CALLE COBRA VIDA — VICLU</div>
      <div className="eclipse-bottom site-container"><p className="eclipse-manifesto">PIEZAS REALES.<br /><span>PARA HISTORIAS REALES.</span></p><div className="eclipse-action"><span>TU ESTILO. TUS REGLAS.</span><CampaignButton href="#catalogo" label="Ver colección" /></div></div>
      <div className="eclipse-baseline site-container"><span>GORRAS DE ESTILO URBANO</span><span>DE COLOMBIA, PARA LA NOCHE.</span></div>
    </section>
  );
}
