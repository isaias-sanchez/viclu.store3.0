import CampaignButton from './CampaignButton';
export default function CityStory() {
  return <section id="ciudad" className="city-story" aria-labelledby="city-title">
    <div className="city-visual" aria-hidden="true"><div className="city-image-plane"><img src="/images/city-poster.webp" width="1536" height="864" loading="lazy" alt="" /><span className="city-manifesto">MISMA<br />PASIÓN.<br />DISTINTAS<br />HISTORIAS.</span></div></div>
    <div className="city-shade" /><div className="site-container city-inner"><div><p className="eyebrow">LA CALLE ES LA PASARELA</p><h2 id="city-title">HECHAS<br />PARA LA CIUDAD</h2><p>Diseños pensados para moverse contigo,<br />resistir el ritmo y marcar la diferencia<br />en cada paso.</p><CampaignButton href="#catalogo" label="Explorar" variant="outline" /></div></div>
  </section>;
}
