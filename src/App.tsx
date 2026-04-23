import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Hero from './components/Hero';
import VideoShowcase from './components/VideoShowcase';
import { FilterBar } from './components/FilterBar';
import ProductCard from './components/ProductCard';
import AdminPage from './pages/Admin';
import { useProducts } from './hooks/useProducts';

// Componente para la Home (Catálogo)
const Catalog = () => {
  const { products } = useProducts();
  const [category, setCategory] = useState<string>('All');

  // Solo mostramos productos ACTIVOS y con STOCK en la tienda
  const availableProducts = products.filter(p => p.active && p.stock > 0);

  const visibleProducts = category === 'All'
    ? availableProducts
    : availableProducts.filter(p => p.category === category);

  // Obtener categorías únicas solo de los productos disponibles
  const categories = Array.from(new Set(availableProducts.map(p => p.category))).sort();

  // Dividir productos en 2 bloques para intercalar videos narrativos
  const half = Math.ceil(visibleProducts.length / 2);
  const firstBlock = visibleProducts.slice(0, half);
  const secondBlock = visibleProducts.slice(half);

  return (
    <Layout>
      <Hero />

      {/* 1er showcase — Narrativa de calle/lifestyle (justo después del hero) */}
      <VideoShowcase
        src="/videos/lifestyle-calle.webm"
        eyebrow="La Calle es la Pasarela"
        title="Hecho para la Ciudad"
        description="Cada gorra nace del pulso urbano. Diseños pensados para moverse con vos, resistir el ritmo y marcar la diferencia en cada paso."
        ctaHref="#catalogo"
        ctaLabel="Explorar Colección"
        align="left"
      />

      <FilterBar
        categories={categories}
        selectedCategory={category}
        onSelectCategory={setCategory}
      />

      <main className="container mx-auto px-4 py-16" id="catalogo">
        <h2 className="text-3xl md:text-4xl font-display text-[#E5E4E2] mb-12 text-center uppercase tracking-wider">
          Colección Disponible
        </h2>

        {visibleProducts.length > 0 ? (
          <>
            {/* Primera mitad del catálogo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {firstBlock.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Segunda mitad (si hay) */}
            {secondBlock.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {secondBlock.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-20">No hay productos disponibles en este momento.</p>
        )}
      </main>

      {/* 2do showcase — Calidad profesional del producto */}
      <VideoShowcase
        src="/videos/producto-studio.webm"
        eyebrow="Atención al Detalle"
        title="Calidad que se Ve"
        description="Materiales seleccionados, bordados precisos y acabados que respetan la forma. Cada pieza pasa por un control estricto antes de salir."
        align="right"
      />

      {/* 3er showcase — Variedad de estilos (al final, como cierre) */}
      <VideoShowcase
        src="/videos/variedad.webm"
        eyebrow="Para Cada Estilo"
        title="Una para Cada Día"
        description="Del fitted clásico al trucker moderno, encontrá la gorra que combine con tu vibra. Variedad auténtica, sin relleno."
        ctaHref="#catalogo"
        ctaLabel="Ver Todas"
        align="left"
      />
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* Capa de textura global */}
      <div className="noise-overlay" />

      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
