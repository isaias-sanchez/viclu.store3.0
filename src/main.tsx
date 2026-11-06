import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@fontsource/bebas-neue/latin-400.css';
import '@fontsource-variable/inter/wght.css';
import './index.css';

const root = document.getElementById('root')!;
const app = <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>;
if (root.dataset.prerendered === 'true') hydrateRoot(root, app);
else createRoot(root).render(app);
