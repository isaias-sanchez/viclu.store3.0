import type { CSSProperties } from 'react';

/** Original VICLU vector illustrations. Decorative, resolution independent assets. */
export function HalloweenMark({ kind = 'skull', className = '' }: { kind?: 'skull' | 'pumpkin' | 'bat'; className?: string }) {
  return <svg className={`halloween-mark ${className}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    {kind === 'skull' ? <>
      <path d="M28 51C20 76 32 88 42 89L43 105H77L78 89C91 85 99 72 91 49Z" fill="#ec702a" stroke="#ec702a" strokeWidth="3" />
      <path d="M24 53C20 16 82 7 96 45L91 57C75 47 48 46 24 53Z" fill="#15100c" stroke="#ec702a" strokeWidth="4" />
      <path d="M16 55C42 40 81 39 105 52C109 60 76 63 56 56Z" fill="#15100c" stroke="#ec702a" strokeWidth="3" />
      <path d="M56 26L63 39L70 24M40 96V104M52 95V104M64 95V104M76 95V104" stroke="#15100c" strokeWidth="3" />
      <path d="M37 68C37 60 53 61 53 70C52 80 34 80 37 68ZM68 70C68 60 85 62 84 69C88 80 69 79 68 70ZM58 78L52 87H65Z" fill="#15100c" />
    </> : kind === 'pumpkin' ? <>
      <path d="M57 31L62 16L73 13L65 32" stroke="currentColor" strokeWidth="5" />
      <path d="M60 34C18 14 7 86 34 100C48 108 51 100 60 102C69 100 73 108 87 100C114 86 102 15 60 34Z" fill="currentColor" />
      <path d="M30 60L46 45L50 67ZM73 45L90 60L71 67ZM29 78L44 81L50 75L60 85L70 75L76 81L92 78L82 91L40 91Z" fill="#15100c" />
    </> : <path d="M60 53L54 42L47 53C30 43 16 30 5 16L10 64C21 52 28 64 29 77C41 63 49 74 60 94C72 74 79 63 91 77C92 64 99 52 110 64L115 16C101 33 87 44 71 53L65 42Z" fill="currentColor" />}
  </svg>;
}

export function WebCorner({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 200 200" className={`web-corner ${className}`} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><path d="M0 0L198 6M0 0L185 77M0 0L140 140M0 0L77 185M0 0L6 198M0 32Q20 36 31 12M0 66Q40 72 61 24Q62 46 47 47Q69 59 66 0M0 104Q64 114 97 40Q95 71 74 74Q112 78 104 0M0 148Q90 158 137 57Q139 109 105 105Q155 119 148 0M0 190Q115 204 176 73Q180 138 135 135Q201 150 190 0" /></svg>;
}

export function HangingSpider({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 70 180" className={`hanging-spider ${className}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M35 0V125M28 137L14 129L6 142M27 143L12 141L3 158M28 149L17 156L14 173M43 137L56 129L64 142M43 143L58 141L67 158M42 149L53 156L56 173" /><ellipse cx="35" cy="146" rx="9" ry="13" fill="currentColor" /><circle cx="35" cy="133" r="6" fill="currentColor" /><path d="M32 143V147M38 143V147" stroke="#14100d" /></svg>;
}

export function HalloweenTexture() {
  return <div className="halloween-texture" aria-hidden="true"><div className="web-pattern" /><WebCorner className="texture-web" /><HangingSpider className="texture-spider" /><HalloweenMark className="texture-skull" /><HalloweenMark kind="bat" className="texture-bat" /></div>;
}

export function AnimatedNight() {
  return <div className="animated-night" aria-hidden="true">
    <div className="night-glow" /><div className="night-fog fog-back" /><div className="night-fog fog-front" />
    {[0, 1, 2].map(i => <div className={`flying-bat bat-${i}`} key={i}><HalloweenMark kind="bat" /></div>)}
    {Array.from({ length: 12 }, (_, i) => <i className="night-ember" key={i} style={{ '--ember-x': `${46 + (i * 17 % 53)}%`, '--ember-delay': `${-i * 1.3}s`, '--ember-duration': `${7 + i % 5}s` } as CSSProperties} />)}
    <WebCorner className="hero-web" /><HangingSpider className="hero-spider" />
  </div>;
}
