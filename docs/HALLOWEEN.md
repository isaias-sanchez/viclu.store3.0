# Campaña Halloween de VICLU.STORE

La campaña usa texto en español, las fotografías reales del catálogo y un sistema de ilustraciones vectoriales originales en `src/components/HalloweenArt.tsx`: calavera con gorra VICLU, calabaza, murciélago, telarañas y araña colgante. La textura repetible está en `public/images/halloween-web-pattern.svg`. No hay bibliotecas de animación adicionales ni videos que descargar.

El hero combina movimiento de cámara sobre la fotografía de campaña, niebla en dos planos, iluminación naranja, murciélagos con aleteo, brasas y una araña que se balancea. El catálogo y el footer tienen telarañas que se desplazan continuamente; el footer incorpora una calavera con gorra y un sello orbital animado. Las tarjetas incluyen etiqueta naranja con calabaza, telaraña en esquina, marco naranja y botón temático.

El control Pausar/Reanudar animaciones en la cabecera detiene o reanuda todos los efectos sin interferir con navegación, búsqueda ni compras. La preferencia del sistema `prefers-reduced-motion: reduce` desactiva las animaciones y el desplazamiento suave. Los adornos se ocultan a lectores de pantalla y no capturan clics.

Para cambiar los colores: variables `--orange` y reglas al final de `src/index.css`. Para cambiar el mensaje principal: `Hero.tsx`; footer: `Layout.tsx`. Las fotos del inventario no se modifican. Los adornos no indican que los modelos sean productos de edición limitada.
