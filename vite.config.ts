import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// React y el enrutador van aparte: el catálogo cambia en cada despliegue, ellos no,
// y así el navegador los conserva en caché entre publicaciones.
const vendorChunks = (id: string) => /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id) ? 'vendor' : undefined;

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: isSsrBuild ? {} : { rollupOptions: { output: { manualChunks: vendorChunks } } },
}))
