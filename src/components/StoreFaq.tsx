import { FAQS } from '../lib/catalog';
export default function StoreFaq() {
  return <section id="preguntas" className="faq-section site-container"><div><p className="eyebrow">ANTES DE SALIR A LA CALLE</p><h2>TODO CLARO.<br /><span>TODO VICLU.</span></h2><p className="section-description">Gorras de estilo urbano en Colombia.<br />Elige la tuya y hablemos por WhatsApp.</p></div><div className="faq-list">{FAQS.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>;
}
