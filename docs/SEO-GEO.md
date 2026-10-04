# VICLU.STORE — Halloween, SEO y GEO

## Qué se entrega

- Campaña Halloween en negro y naranja, portada fotográfica, catálogo de cuatro columnas en escritorio y dos en móvil, menú móvil, búsqueda y sección urbana.
- Marca VICLU.STORE y precios literales del inventario (30 / 40 / 50 COP), confirmados por el propietario. No se modifica la base de datos ni se multiplica el precio.
- Páginas HTML para inicio, cada colección disponible y cada producto activo, además de 404 y administración.
- Datos reales de Supabase: la compilación falla si el inventario no puede consultarse; no publica productos ficticios.
- Canonical y metadatos sociales por URL; Product/Offer y BreadcrumbList en fichas individuales; organización, WebSite y FAQ con texto visible.
- Sitemap generado del catálogo y robots.txt para todos los crawlers. Admin noindex en HTML y cabecera HTTP; Supabase Auth sigue siendo el control de acceso.
- Fotos reales optimizadas en WebP a 360, 600 y 900 px, srcset, lazy loading y dimensiones reservadas. El original se conserva para WhatsApp y metadatos sociales. En esta revisión, 94,1 MB de originales se reducen a 5,8 MB para las tres variantes combinadas.
- El panel admin conserva su funcionamiento y carga en un chunk independiente.

## Actualización del inventario

La web entrega HTML prerenderizado para usuarios y crawlers por igual; React lo hidrata y vuelve a consultar Supabase. Las fotos nuevas o modificadas por una nueva URL usan su original hasta el siguiente deploy. La disponibilidad que cambia en Supabase se refresca en el navegador, incluyendo estado agotado y JSON-LD de la ficha.

**Después de crear, renombrar, desactivar un producto o cambiar precios/categorías, ejecutar un nuevo despliegue para renovar HTML, fotos optimizadas y sitemap.** Los cambios de stock también requieren rebuild para que el HTML leído sin JavaScript coincida. No se configuró una automatización de redeploy ni se prometió sincronización continua del HTML. El visitante recibe un aviso de confirmación por WhatsApp si el refresco del inventario falla.

Las URLs combinan el modelo y su UUID. Si se cambia el nombre/descripción/color, la URL del próximo despliegue cambia: conservar el texto del modelo cuando ya está indexado, o añadir una redirección 301 desde la URL anterior. Duplicados del nombre se distinguen por UUID; conviene enriquecer los nombres/descripciones en administración sin inventar atributos del producto.

## Validaciones

```sh
npm ci
# Configurar variables VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY y contacto.
npm run build
npm run lint
npm run check:seo
npm run preview
```

`check:seo` comprueba HTML antes de JS, un h1 por página, JSON-LD parseable, precios/stock reales, enlaces internos, canonical de producto, URLs únicas, sitemap y exclusión de admin. Se revisan también portada y fichas en móvil/escritorio, búsqueda, menú y enlaces WhatsApp sin enviar mensajes.

El snapshot y las variantes del inventario se generan en build y están excluidos de Git. No usar service-role keys: únicamente la clave pública existente, con RLS para proteger escrituras.

## Publicación e indexación

1. Revisar el PR y su preview; integrar por PR a main según la regla de trabajo colaborativo.
2. Verificar en producción `/`, una categoría, una ficha, `/robots.txt`, `/sitemap.xml` y que una URL inexistente responde 404.
3. En Google Search Console, verificar la propiedad `viclu.store` y enviar `https://viclu.store/sitemap.xml`.
4. Inspeccionar inicio, una categoría y una ficha; solicitar indexación. Validar la ficha con Rich Results Test. Estas acciones requieren acceso del propietario a la propiedad y no se han ejecutado en esta entrega.
5. Comparar clics, impresiones y consultas a 28 días; medir consultas reales en WhatsApp. No se añadió Analytics ni seguimiento de usuarios sin una configuración existente.

Esta entrega prepara páginas rastreables; no certifica que Google ya las haya indexado ni garantiza posiciones o tráfico. Para aparecer en las experiencias de IA de Google, siguen aplicando las prácticas SEO: contenido útil, accesible en texto, enlaces internos y datos estructurados acordes al contenido visible. No se necesita un archivo llms.txt ni un marcado especial de IA. La FAQ ayuda a clientes y a interpretar el negocio; no se promete un resultado enriquecido FAQ para esta tienda.

Fuentes: [Google: funciones de IA y tu sitio](https://developers.google.com/search/docs/appearance/ai-features), [Google: datos de producto](https://developers.google.com/search/docs/appearance/structured-data/product).

## Material gráfico de campaña

Skill usada: `/Users/isaias/.codex/skills/.system/imagegen/SKILL.md`, herramienta integrada image_gen (sin API CLI). Son imágenes de campaña, no sustitutos de fotos del inventario.

- `public/images/halloween-hero.webp`: foto editorial de gorra negra en asfalto mojado, callejón oscuro, grafiti naranja de jack-o-lantern, espacio oscuro a la izquierda para el titular, sin textos o marcas de terceros.
- `public/images/halloween-cap-eclipse.webp`: nueva pieza protagonista del hero, gorra negra con cinta satinada naranja y fondo transparente, 1000 × 1000, 198 KB. El titular y el eclipse se construyen en HTML/SVG para conservar texto indexable y animación por capas.
- `public/images/city-poster.webp`: hombre adulto de espaldas, gorra y hoodie negros, callejón colombiano al atardecer, luces ámbar y espacio a la izquierda para el texto, sin textos/logos.

Prompts completos de generación guardados en `docs/image-prompts.md`.

## Refuerzo orgánico y local — 2026-10-04

Marca confirmada: **VICLU.STORE**. Modalidad confirmada: exclusivamente online. Se añaden `/gorras-en-barranquilla`, `/guia-de-gorras` y `/envios-y-compras`, con contenido útil, FAQ específica, enlaces al catálogo y HTML prerenderizado. El inicio y las colecciones enlazan la página local; el footer enlaza las tres páginas y muestra el contacto público existente. El título principal del sitio pasa a describir la tienda y su alcance durante todo el año, conservando la campaña visual aprobada.

La entidad OnlineStore especifica Colombia y Barranquilla como áreas atendidas, sin atribuir una sede presencial. Se añaden ItemList para los productos enlazados, datos de marca/color disponibles en títulos de fichas y comprobaciones de FAQ visible, canonical por URL y ausencia de datos físicos inventados. El sitemap contiene 66 URLs indexables en el inventario actual.

Auditoría, mapa de consultas, métricas disponibles y pendientes: [LOCAL-SEO-ANALYSIS-viclu.store.md](LOCAL-SEO-ANALYSIS-viclu.store.md). El envío del sitemap y la inspección de Google requieren iniciar sesión en Search Console; abrir el portal no equivale a haber ejecutado esas acciones.
