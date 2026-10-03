import { Link } from 'react-router-dom';
import { categoryPath } from '../lib/catalog';

export function FilterBar({ categories, selectedCategory }: { categories: string[]; selectedCategory?: string }) {
  return <nav className="filter-bar" aria-label="Filtrar colección"><Link to="/#catalogo" className={!selectedCategory ? 'selected' : ''} aria-current={!selectedCategory ? 'page' : undefined}>Todos</Link>{categories.map(cat => <Link key={cat} to={categoryPath(cat)} className={selectedCategory === cat ? 'selected' : ''} aria-current={selectedCategory === cat ? 'page' : undefined}>{cat}</Link>)}</nav>;
}
