/* Server rendering entry: no React Fast Refresh exports are needed here. */
/* eslint-disable react-refresh/only-export-components */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { catalogSnapshot, categoryPath, getCategories, productPath, SITE_URL } from './lib/catalog';
import { pageMetadata, structuredData } from './lib/seo';

export function getPages() {
  return [
    { path: '/', options: {} },
    ...getCategories(catalogSnapshot).map(category => ({ path: categoryPath(category), options: { category } })),
    ...catalogSnapshot.map(product => ({ path: productPath(product), options: { product } })),
    { path: '/404', options: { notFound: true } },
  ];
}
export function render(path: string) {
  return renderToString(<StaticRouter location={path}><App /></StaticRouter>);
}
export { SITE_URL, pageMetadata, structuredData };
