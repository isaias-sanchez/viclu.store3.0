import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, MessageCircle, Truck, Ruler, Instagram } from 'lucide-react';
import { Layout } from '../components/Layout';
import PageSeo from '../components/PageSeo';
import ProductCard from '../components/ProductCard';
import StoreFaq from '../components/StoreFaq';
import { HalloweenTexture } from '../components/HalloweenArt';
import { useProducts } from '../hooks/useProducts';
import { categoryPath, getCategories } from '../lib/catalog';
import { EDITORIAL_PAGES, CATEGORY_DESCRIPTIONS, STORE_DESCRIPTION, type EditorialPage } from '../lib/editorial';
import { APP_CONFIG, WHATSAPP_PHONE } from '../lib/constants';

export default function StoreInformation({ page }: { page: EditorialPage }) {
  const content = EDITORIAL_PAGES[page];
  const { products, error } = useProducts();
  const categories = getCategories(products);
  const picks = categories.flatMap(category => products.filter(p => p.active && p.stock > 0 && p.category === category).slice(0, 1));
  const whatsapp = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(page === 'barranquilla' ? 'Hola VICLU.STORE, quiero consultar una gorra y el envío a Barranquilla.' : 'Hola VICLU.STORE, quiero consultar una gorra y los detalles de mi pedido.')}`;
  return <Layout><PageSeo editorial={page} />
    <section className="information-hero site-container">
      <HalloweenTexture />
      <Link className="breadcrumb" to="/#catalogo"><ArrowLeft size={14} /> Volver al catálogo</Link>
      <div className="information-hero-grid"><div><p className="eyebrow">{content.eyebrow}</p><h1>{content.heading}{' '}<br /><em>{content.accent}</em></h1><p className="information-intro">{content.intro}</p><a href={whatsapp} className="button button-orange" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <ArrowUpRight size={18} /></a></div>
        <aside className="information-note"><span className="eyebrow">SIN MISTERIOS / VICLU.STORE</span><MessageCircle size={36} aria-hidden="true" /><p>{page === 'barranquilla' ? 'Compra online. Confirma disponibilidad y envío a Barranquilla antes de pagar.' : page === 'guia' ? 'El mejor ajuste empieza con una pregunta. Consulta los detalles de tu modelo.' : 'Una gorra, una conversación. Acordamos contigo los detalles del pedido.'}</p><span>Tienda exclusivamente online · Colombia</span></aside></div>
    </section>
    <div className="information-content site-container">
      {page === 'barranquilla' ? <>
        <section className="information-section"><p className="eyebrow">TU CIUDAD. TU ESTILO.</p><h2>COMPRA GORRAS ONLINE EN BARRANQUILLA</h2><p>VICLU.STORE ofrece un catálogo online de gorras con envío dentro de Colombia, incluida Barranquilla. Aquí puedes ver fotos y precios de los modelos disponibles y hablar directamente con la tienda para organizar tu compra. Somos una tienda exclusivamente online, sin local abierto al público.</p><p>Elige una gorra para tu día a día o para regalar. Las fichas muestran el modelo, la colección y los datos disponibles del inventario. Si quieres comparar dos piezas, envía sus enlaces por WhatsApp y pregunta por sus diferencias antes de decidir.</p></section>
        <CollectionLinks categories={categories} />
        <section className="information-section"><h2>ANTES DE COORDINAR TU ENVÍO</h2><ol className="purchase-steps"><li><strong>Elige el modelo.</strong> Abre su ficha y usa el botón de consulta para identificar la gorra que quieres.</li><li><strong>Pregunta por disponibilidad y ajuste.</strong> Confirma stock, medidas y tipo de cierre del modelo concreto.</li><li><strong>Indica tu destino.</strong> Consulta el costo, la cobertura para tu dirección en Barranquilla y el plazo estimado.</li><li><strong>Confirma el total.</strong> Acuerda la forma de pago y el valor del pedido con envío antes de pagar.</li></ol><Link className="information-link" to="/envios-y-compras">Ver cómo funcionan los pedidos <ArrowUpRight size={16} /></Link></section>
      </> : page === 'guia' ? <>
        <section className="information-section"><p className="eyebrow">EL DISEÑO ES SOLO EL COMIENZO</p><h2>CÓMO ELEGIR UNA GORRA ONLINE</h2><p>Para elegir una gorra, combina el diseño que te gusta con un ajuste que puedas confirmar. Las fotos ayudan a comparar la forma de la visera, los detalles del frente y los colores de cada pieza. Revisa todas las imágenes disponibles y pregunta por lo que no se vea claramente.</p><p>Los nombres beisbolera, camionera o multimarca sirven para explorar el catálogo; no garantizan por sí solos un material, un tipo de cierre o una talla. Consulta las características de la gorra específica que quieres comprar.</p></section>
        <CollectionLinks categories={categories} />
        <section className="information-section"><h2>MIDE, COMPARA Y PREGUNTA</h2><p>Rodea tu cabeza con una cinta métrica flexible, a la altura donde llevarás la gorra y sin apretarla. Anota la medida en centímetros y compártela por WhatsApp junto con el enlace del producto. Pide que te confirmen las medidas o el rango de ajuste de ese modelo.</p><ul className="purchase-steps"><li>Pregunta si el cierre permite ajustar el contorno y cómo funciona.</li><li>Si es un regalo, intenta conseguir una medida de quien la usará.</li><li>Consulta las condiciones de cambios antes de completar el pedido.</li><li>Para el cuidado, revisa la etiqueta y las indicaciones del modelo; no asumas que todas las gorras admiten el mismo lavado.</li></ul><Link className="information-link" to="/envios-y-compras">Preparar mi pedido <ArrowUpRight size={16} /></Link></section>
      </> : <>
        <section className="information-section"><p className="eyebrow">QUIÉNES SOMOS / CÓMO COMPRAR</p><h2>VICLU.STORE, TU TIENDA ONLINE DE GORRAS</h2><p>{STORE_DESCRIPTION}</p><p>Esta web presenta las fotos y los precios del catálogo. El pedido se acuerda directamente con la tienda por WhatsApp. Antes de pagar, confirma la disponibilidad de la pieza, sus características, el valor total y las condiciones aplicables a la compra.</p></section>
        <section className="information-section"><h2>DEL CATÁLOGO A TU PEDIDO</h2><ol className="purchase-steps"><li><strong>Explora.</strong> Busca por colección, marca, modelo o color y abre una ficha.</li><li><strong>Consulta.</strong> El botón de WhatsApp prepara un mensaje con el producto y el precio mostrado.</li><li><strong>Confirma.</strong> Revisa stock, ajuste, forma de pago y condiciones de compra con la tienda.</li><li><strong>Coordina.</strong> Indica tu destino y acuerda el costo y el tiempo del envío antes de pagar.</li></ol><p>El stock puede cambiar entre consultas. La confirmación por WhatsApp permite comprobar que la gorra sigue disponible. Los precios se muestran en pesos colombianos (COP); el transporte y el total deben confirmarse con la tienda.</p></section>
        <section className="information-section"><h2>ENVÍOS EN COLOMBIA Y CONTACTO</h2><p>Coordinamos envíos dentro de Colombia. El costo y el tiempo de entrega dependen del pedido y del destino y se consultan por WhatsApp. Para compradores de Barranquilla, reunimos el catálogo y las indicaciones de compra en una página dedicada.</p><div className="information-actions"><Link className="information-link" to="/gorras-en-barranquilla"><Truck size={17} /> Gorras con envío a Barranquilla</Link><a className="information-link" href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> WhatsApp: +{WHATSAPP_PHONE}</a><a className="information-link" href={APP_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={17} /> Instagram de VICLU.STORE</a></div><p>No tenemos local abierto al público. Consulta por WhatsApp los detalles de entrega y las condiciones de cambios o devoluciones antes de confirmar tu compra.</p></section>
      </>}
      {page !== 'compras' && picks.length > 0 && <section className="information-section"><h2>EXPLORA EL CATÁLOGO REAL</h2><p>Una muestra de las colecciones disponibles. Abre cada ficha para ver sus detalles y consulta el stock antes de pedir.</p>{error && <p role="status">No pudimos actualizar el inventario. Confirma la disponibilidad por WhatsApp.</p>}<div className="product-grid">{picks.map(product => <ProductCard product={product} key={product.id} />)}</div><Link to="/#catalogo" className="information-link">Ver todos los modelos <ArrowUpRight size={16} /></Link></section>}
      <div className="information-next"><Ruler size={20} /><Link to={page === 'guia' ? '/gorras-en-barranquilla' : '/guia-de-gorras'}>{page === 'guia' ? '¿Compras desde Barranquilla? Consulta los envíos' : 'Lee la guía para elegir tu gorra'}</Link><ArrowUpRight size={18} /></div>
    </div>
    <StoreFaq questions={content.questions} />
  </Layout>;
}

function CollectionLinks({ categories }: { categories: string[] }) {
  return <section className="information-section"><h2>ENCUENTRA TU COLECCIÓN</h2><div className="collection-guides">{categories.map(category => <article key={category}><span className="eyebrow">COLECCIÓN VICLU</span><h3><Link to={categoryPath(category)}>Gorras {category.toLowerCase()}</Link></h3><p>{CATEGORY_DESCRIPTIONS[category]}</p><Link className="information-link" to={categoryPath(category)}>Ver modelos <ArrowUpRight size={16} /></Link></article>)}</div></section>;
}
