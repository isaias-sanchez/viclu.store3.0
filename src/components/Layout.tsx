import { useState, type ReactNode } from 'react';
import { Instagram, Menu, X, Search, UserRound, MessageCircle, Truck, ShieldCheck, ScanFace } from 'lucide-react';
import { HalloweenMark, WebCorner, HangingSpider } from './HalloweenArt';
import SpiritLantern from './SpiritLantern';
import CampaignButton from './CampaignButton';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG, WHATSAPP_PHONE } from '../lib/constants';
import { catalogSnapshot, categoryPath, getCategories } from '../lib/catalog';

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const categories = getCategories(catalogSnapshot);
  const closeMenu = () => setMenuOpen(false);
  return (
    <div className="store-layout">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="announcement"><span>✦ ESPECIAL HALLOWEEN</span><span className="announcement-divider">/</span><span>ENVÍOS A TODA COLOMBIA</span><span className="announcement-desktop">/ OCTUBRE 2026 ✦</span></div>
      <header className="store-header">
        <div className="header-atmosphere" aria-hidden="true"><WebCorner className="header-web" /><div className="header-glow" /><div className="header-scan" /></div>
        <div className="header-inner site-container">
          <Link className="wordmark header-brand" to="/" aria-label="VICLU.STORE, inicio" onClick={closeMenu}><span className="brand-emblem"><HalloweenMark kind="pumpkin" /></span><span className="brand-name">VICLU<span>.STORE</span><small>ESPECIAL HALLOWEEN</small></span></Link>
          <nav className="desktop-nav" aria-label="Colecciones">
            <Link to="/#catalogo" aria-current={pathname === '/' ? 'page' : undefined}>Todos</Link>
            {categories.map(cat => <Link key={cat} to={categoryPath(cat)} aria-current={pathname === categoryPath(cat) ? 'page' : undefined}>{cat}</Link>)}
          </nav>
          <div className="header-actions">
            <Link className="icon-link" to="/#buscar" aria-label="Buscar gorras"><Search size={19} /></Link>
            <Link className="icon-link account-link" to="/admin" aria-label="Acceso de administración"><UserRound size={18} /></Link>
            <a className="icon-link" href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer" aria-label="Contactar a VICLU por WhatsApp"><MessageCircle size={19} /></a>
            <button className="menu-toggle icon-link" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          </div>
        </div>
        {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Colecciones móvil"><Link to="/#catalogo" onClick={closeMenu}>Todos los modelos</Link>{categories.map(cat => <Link key={cat} to={categoryPath(cat)} onClick={closeMenu}>{cat}</Link>)}<Link to="/admin" onClick={closeMenu}>Administración</Link></nav>}
      </header>
      <main id="contenido">{children}</main>
      <section className="trust-strip site-container" aria-label="Comprar en VICLU"><div><Truck size={25} /><p>ENVÍOS<span>A TODA COLOMBIA</span></p></div><div><ShieldCheck size={25} /><p>ATENCIÓN DIRECTA<span>POR WHATSAPP</span></p></div><div><ScanFace size={25} /><p>ESTILO URBANO<span>SIN LÍMITES</span></p></div></section>
      <footer id="contacto" className="halloween-footer"><WebCorner className="footer-web" /><HangingSpider className="footer-spider" />
        <div className="footer-campaign site-container"><div className="footer-copy"><p className="eyebrow">LA NOCHE ES TUYA / HALLOWEEN 2026</p><h2>ESTILO DE<br /><span>OTRO MUNDO.</span></h2><CampaignButton href={`https://wa.me/${WHATSAPP_PHONE}`} label="Encuentra tu gorra" external /></div><SpiritLantern /></div>
        <div className="store-footer site-container">
        <div><Link to="/" className="wordmark">VICLU.STORE</Link><p>Gorras para llevar tu historia.<br />Desde Colombia, para la calle.</p></div>
        <nav aria-label="Información"><a href="/#preguntas">Envíos y compras</a><a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={APP_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={14} /> Instagram</a></nav>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} VICLU.STORE</span><span>¿TRUCO O ESTILO? / ESPECIAL HALLOWEEN</span><a href="https://actaproyect.online/" target="_blank" rel="noopener noreferrer">Diseñado por ACTA</a></div>
        </div>
      </footer>
    </div>
  );
}
