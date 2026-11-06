import { Link } from 'react-router-dom';
import { categoryPath } from '../lib/catalog';
import { cn } from '../lib/utils';

export function FilterBar({ categories, selectedCategory }: { categories: string[]; selectedCategory?: string }) {
  const linkClass = (selected: boolean) => cn(
    'text-xl font-display tracking-widest uppercase transition-colors whitespace-nowrap',
    selected ? 'text-brand-platinum border-b-2 border-brand-platinum' : 'text-brand-platinum/50 hover:text-brand-platinum/80',
  );
  return (
    <nav className="filter-bar flex gap-6 overflow-x-auto pb-2 sm:justify-center" aria-label="Filtrar colección">
      <Link to="/#catalogo" className={linkClass(!selectedCategory)} aria-current={!selectedCategory ? 'page' : undefined}>Todos</Link>
      {categories.map(cat => (
        <Link key={cat} to={categoryPath(cat)} className={linkClass(selectedCategory === cat)} aria-current={selectedCategory === cat ? 'page' : undefined}>{cat}</Link>
      ))}
    </nav>
  );
}
