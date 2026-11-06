import { type ReactNode } from 'react';
import { Instagram, MessageCircle, Search, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_CONFIG, WHATSAPP_PHONE } from '../lib/constants';
import { catalogSnapshot, categoryPath, getCategories } from '../lib/catalog';

const iconLink = 'w-9 h-9 flex items-center justify-center text-brand-platinum/70 hover:text-brand-platinum transition-colors';
const footerLink = 'text-xs uppercase tracking-widest text-brand-platinum/60 hover:text-brand-platinum transition-colors';

export function Layout({ children }: { children: ReactNode }) {
  const categories = getCategories(catalogSnapshot);
  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-platinum selection:text-brand-black">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-brand-black/95 border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-widest text-brand-platinum" aria-label="VICLU.STORE, inicio">
            VICLU<span className="text-brand-platinum/50">.STORE</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link className={iconLink} to="/#buscar" aria-label="Buscar gorras"><Search size={18} aria-hidden="true" /></Link>
            <a className={iconLink} href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer" aria-label="Contactar a VICLU por WhatsApp"><MessageCircle size={18} aria-hidden="true" /></a>
            <Link className={`${iconLink} ml-1 w-8 h-8 rounded-full border border-brand-platinum/20`} to="/admin" aria-label="Acceso de administración"><UserRound size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="contenido" className="flex-1 container mx-auto px-4">
        {children}
      </main>

      {/* Footer */}
      <footer id="contacto" className="py-12 border-t border-white/5 mt-20">
        <div className="container mx-auto px-4 text-center space-y-6">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3" aria-label="Colecciones">
            {categories.map(cat => <Link key={cat} className={footerLink} to={categoryPath(cat)}>{cat}</Link>)}
          </nav>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3" aria-label="Información">
            <Link className={footerLink} to="/gorras-en-barranquilla">Gorras en Barranquilla</Link>
            <Link className={footerLink} to="/guia-de-gorras">Guía de gorras</Link>
            <Link className={footerLink} to="/envios-y-compras">Envíos y compras</Link>
          </nav>
          <div className="space-y-2">
            <p className="font-display text-xl tracking-widest text-brand-platinum/60">VICLU STORE © {new Date().getFullYear()}</p>
            <p className="text-xs text-brand-platinum/60">Tienda online de gorras · Colombia · Pedidos y envíos por WhatsApp: <a className="hover:text-brand-platinum transition-colors" href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer">+{WHATSAPP_PHONE}</a></p>
            <a href={APP_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 ${footerLink}`}>
              <span>Síguenos en Instagram</span>
              <Instagram className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href="https://actaproyect.online/" target="_blank" rel="noopener noreferrer" className="block text-xs text-brand-platinum/50 uppercase tracking-widest mt-4 hover:text-brand-platinum/70 transition-colors">
              Designed by ACTA
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
