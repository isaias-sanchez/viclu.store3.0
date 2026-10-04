import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useParams, useLocation, Link } from 'react-router-dom';
import { Search, ArrowLeft, MessageCircle, Truck, ArrowUpRight } from 'lucide-react';
import { Layout } from './components/Layout';
import Hero from './components/Hero';
import { HalloweenTexture } from './components/HalloweenArt';
import CityStory from './components/CityStory';
import StoreFaq from './components/StoreFaq';
import { FilterBar } from './components/FilterBar';
import ProductCard from './components/ProductCard';
import PageSeo from './components/PageSeo';
import { useProducts } from './hooks/useProducts';
import { categoryPath, getCategories, productName, slugify, productImage, productSrcSet } from './lib/catalog';
import { formatPrice, generateWhatsAppLink } from './lib/utils';
import { WHATSAPP_PHONE } from './lib/constants';
import { CATEGORY_DESCRIPTIONS, EDITORIAL_PAGES } from './lib/editorial';
import StoreInformation from './pages/StoreInformation';

const AdminPage = lazy(() => import('./pages/Admin'));

function Catalog() {
  const { products, loading, error, refreshProducts } = useProducts();
  const { categorySlug } = useParams();
  const [search, setSearch] = useState('');
  const categories = getCategories(products);
  const category = categories.find(cat => slugify(cat) === categorySlug);
  if (categorySlug && !category && !loading) return <NotFound />;
  const available = products.filter(p => p.active && p.stock > 0);
  const visible = available.filter(p => (!category || p.category === category) && (!search || slugify(`${p.name} ${p.description} ${p.brand} ${p.color}`).includes(slugify(search))));
  return <Layout>
    <PageSeo category={category} />
    {!categorySlug && <Hero />}
    <section className={`catalog-section site-container ${categorySlug ? 'collection-page' : ''}`} id="catalogo">
      <HalloweenTexture />
      <div className="catalog-heading"><div>{categorySlug && <Link to="/#catalogo" className="breadcrumb"><ArrowLeft size={14} /> Todas las gorras</Link>}<p className="eyebrow">ELIGE TU PRÓXIMA HISTORIA</p>{categorySlug ? <h1>GORRAS {category || categorySlug}</h1> : <h2>COLECCIÓN DISPONIBLE<span className="heading-spark" aria-hidden="true">✦</span></h2>}</div><span className="catalog-count">{visible.length} {visible.length === 1 ? 'MODELO' : 'MODELOS'} / TU ESTILO</span></div>
      <p className="collection-description">{category ? CATEGORY_DESCRIPTIONS[category] : 'Tu tienda online de gorras en Colombia: beisboleras, camioneras, multimarca y Selección Colombia. Compara fotos y precios del catálogo y confirma tu pedido por WhatsApp.'} <Link to="/gorras-en-barranquilla">¿Buscas gorras en Barranquilla? Consulta los envíos.</Link></p>
      <div className="catalog-toolbar"><FilterBar categories={categories} selectedCategory={category} /><label className="catalog-search" id="buscar"><Search size={15} /><span className="sr-only">Buscar en la colección</span><input type="search" placeholder="Busca tu estilo" value={search} onChange={e => setSearch(e.target.value)} /></label></div>
      {error && <div className="inventory-notice" role="status">No pudimos actualizar la disponibilidad. Confirma el stock por WhatsApp. <button onClick={() => void refreshProducts()}>Reintentar</button></div>}
      {visible.length > 0 ? <div className="product-grid">{visible.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-collection" role="status"><h3>{loading ? 'Cargando colección…' : 'No encontramos ese estilo'}</h3><p>{search ? 'Prueba con otra marca, color o modelo.' : 'Consulta por WhatsApp los próximos modelos disponibles.'}</p>{search && <button className="button button-outline" onClick={() => setSearch('')}>Ver todos los modelos</button>}</div>}
      <div className="catalog-bottom"><span>PIEZAS REALES. ACTITUD PROPIA.</span><a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer">¿No sabes cuál elegir? Hablemos <ArrowUpRight size={15} /></a></div>
    </section>
    <CityStory />
    <StoreFaq />
  </Layout>;
}

function ProductPage() {
  const { productSlug } = useParams();
  const { products, loading, error } = useProducts();
  const id = productSlug?.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)?.[0];
  const product = products.find(p => p.id === id && p.active);
  if (!product) return loading ? <Layout><p className="loading-product">Cargando modelo…</p></Layout> : <NotFound />;
  const available = product.stock > 0;
  return <Layout><PageSeo product={product} />
    <div className="product-detail site-container"><nav className="breadcrumb" aria-label="Ruta de navegación"><Link to="/#catalogo">Colección</Link><span>/</span><Link to={categoryPath(product.category)}>{product.category}</Link></nav><div className="product-detail-grid"><div className="detail-image">{product.image && <img src={productImage(product, 'detail')} srcSet={productSrcSet(product)} sizes="(max-width: 580px) 100vw, 600px" alt={productName(product)} width="900" height="900" fetchPriority="high" />}</div><div className="detail-copy"><p className="eyebrow">{product.category} / {product.brand.trim()}</p><h1>{productName(product)}</h1><p className="detail-price">{formatPrice(product.price)} <span>COP</span></p><p className="stock-label"><span className="orange-dot" />{error ? 'Confirma disponibilidad por WhatsApp' : available ? 'Disponible para consultar' : 'Actualmente agotada'}</p><dl><div><dt>Marca</dt><dd>{product.brand.trim()}</dd></div><div><dt>Colección</dt><dd>{product.category}</dd></div>{product.color && product.color.trim() !== 'N/A' && <div><dt>Color</dt><dd>{product.color.trim()}</dd></div>}{product.description && <div><dt>Modelo</dt><dd>{product.description.trim()}</dd></div>}</dl><a className="button button-orange" href={generateWhatsAppLink(product)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />{available ? 'Consultar por WhatsApp' : 'Consultar próximos ingresos'}</a><p className="detail-shipping"><Truck size={17} /> Envíos en Colombia. Costo y entrega a confirmar.</p><p className="detail-note">Confirma medidas, ajuste, disponibilidad y forma de pago con la tienda antes de realizar tu pedido.</p></div></div><div className="related-products"><h2>OTRAS HISTORIAS PARA LLEVAR</h2><div className="product-grid">{products.filter(p => p.active && p.stock > 0 && p.id !== product.id && p.category === product.category).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}</div></div></div><StoreFaq /></Layout>;
}

function NotFound() {
  return <Layout><PageSeo notFound /><section className="not-found site-container"><p className="eyebrow">404 / FUERA DE LA COLECCIÓN</p><h1>ESTA HISTORIA<br />NO ESTÁ AQUÍ.</h1><p>El enlace no existe o el modelo ya no está disponible.</p><Link to="/" className="button button-light">Volver a la tienda <ArrowUpRight size={16} /></Link></section></Layout>;
}

function ScrollToLocation() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        target?.scrollIntoView();
        if (hash === '#buscar') target?.querySelector('input')?.focus({ preventScroll: true });
      } else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return <><ScrollToLocation /><Routes><Route path="/" element={<Catalog />} /><Route path="/coleccion/:categorySlug" element={<Catalog />} /><Route path="/gorras/:productSlug" element={<ProductPage />} />{(Object.keys(EDITORIAL_PAGES) as (keyof typeof EDITORIAL_PAGES)[]).map(page => <Route key={page} path={EDITORIAL_PAGES[page].path} element={<StoreInformation page={page} />} />)}<Route path="/admin" element={<Suspense fallback={<p className="loading-product">Cargando administración…</p>}><AdminPage /></Suspense>} /><Route path="*" element={<NotFound />} /></Routes></>;
}
