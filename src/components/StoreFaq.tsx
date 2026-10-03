import { FAQS } from '../lib/catalog';
import { HalloweenMark, WebCorner } from './HalloweenArt';
export default function StoreFaq() {
  return <section id="preguntas" className="faq-section site-container"><WebCorner className="faq-web" /><div><p className="eyebrow">QUE EL ÚNICO SUSTO SEA TU ESTILO</p><h2>TODO CLARO.<br /><span>TODO VICLU.</span></h2><p className="section-description">Gorras de estilo urbano en Colombia.<br />Elige la tuya y hablemos por WhatsApp.</p><div className="faq-seal"><HalloweenMark kind="pumpkin" /><span>BUEN ESTILO.<br />CERO MISTERIOS.</span></div></div><div className="faq-list">{FAQS.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>;
}
