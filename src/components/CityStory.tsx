import { ArrowUpRight } from 'lucide-react';
import { HalloweenMark } from './HalloweenArt';
export default function CityStory() {
  return <section className="city-story" aria-labelledby="city-title"><img src="/images/city-poster.webp" width="1536" height="1024" loading="lazy" alt="" /><div className="city-shade" /><div className="site-container city-inner"><div><p className="eyebrow">LA CALLE ES LA PASARELA</p><h2 id="city-title">HECHAS<br />PARA LA CIUDAD</h2><p>Diseños pensados para moverse contigo,<br />resistir el ritmo y marcar la diferencia<br />en cada paso.</p><a className="button button-outline" href="#catalogo">Explorar <ArrowUpRight size={16} /></a></div><span className="city-manifesto" aria-hidden="true"><HalloweenMark kind="bat" />MISMA<br />PASIÓN.<br />DISTINTAS<br />HISTORIAS.</span></div></section>;
}
