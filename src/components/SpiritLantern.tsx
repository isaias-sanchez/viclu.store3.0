import type { CSSProperties, PointerEvent } from 'react';
import { useMotionStage } from '../hooks/useMotionStage';

export default function SpiritLantern() {
  const ref = useMotionStage<HTMLDivElement>();
  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    event.currentTarget.style.setProperty('--spirit-x', `${x * 12}deg`);
    event.currentTarget.style.setProperty('--spirit-y', `${-y * 10}deg`);
  };
  const resetPointer = () => {
    ref.current?.style.setProperty('--spirit-x', '0deg');
    ref.current?.style.setProperty('--spirit-y', '0deg');
  };
  return <div className="footer-mascot motion-stage" ref={ref} onPointerMove={followPointer} onPointerLeave={resetPointer} aria-hidden="true">
    <div className="spirit-halo" />
    <div className="spirit-tilt">
      <svg className="spirit-orbits" viewBox="0 0 420 360" fill="none">
        <ellipse className="spirit-ring ring-outer" cx="210" cy="178" rx="188" ry="125" stroke="currentColor" strokeWidth=".6" strokeDasharray="190 110 60 100" />
        <ellipse className="spirit-ring ring-inner" cx="210" cy="178" rx="153" ry="155" stroke="currentColor" strokeWidth="1" strokeDasharray="2 15" />
        <path className="spirit-sweep" d="M22 178C22 108 106 53 210 53" stroke="currentColor" strokeWidth="2" />
      </svg>
      <div className="spirit-smoke smoke-left" /><div className="spirit-smoke smoke-right" />
      <div className="spirit-object"><img src="/images/halloween-spirit-v2.webp" alt="" width="800" height="800" loading="lazy" decoding="async" draggable={false} /><div className="spirit-flare" /></div>
      {Array.from({ length: 9 }, (_, i) => <i className="spirit-spark" key={i} style={{ '--spark-angle': `${i * 40}deg`, '--spark-delay': `${-i * .65}s` } as CSSProperties} />)}
      <div className="spirit-floor" />
    </div>
    <span className="spirit-signature">VICLU · ESPÍRITU CALLEJERO</span>
  </div>;
}
