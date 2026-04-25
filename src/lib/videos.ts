/**
 * URLs de los videos de showcase.
 *
 * Hosted en Supabase Storage (bucket public_203).
 * Tokens firmados con expiración 2027-04-25.
 *
 * El video del Hero se mantiene local en /videos/hero.webm
 * para LCP rápido (no depende de DNS lookup externo).
 */
export const VIDEO_URLS = {
    /** Showcase 1 — "Hecho para la Ciudad" (lifestyle urbano) */
    lifestyle: 'https://mvvmmewieigfslvqroia.supabase.co/storage/v1/object/sign/public_203/gorras_calle.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83OTE2ZWYzYi01NjJhLTQzMTQtODZhYy1kNTliMTQ3OGVkYzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwdWJsaWNfMjAzL2dvcnJhc19jYWxsZS53ZWJtIiwiaWF0IjoxNzc3MTM2Mjc2LCJleHAiOjE4MDg2NzIyNzZ9.svLylcMxWLil1LsmSrUESxJtJQkqbGTLWy9Ey3zhe7Q',

    /** Showcase 2 — "Que Hablen las Imágenes" (editorial / cinematográfico) */
    editorial: 'https://mvvmmewieigfslvqroia.supabase.co/storage/v1/object/sign/public_203/gorras_kling.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83OTE2ZWYzYi01NjJhLTQzMTQtODZhYy1kNTliMTQ3OGVkYzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwdWJsaWNfMjAzL2dvcnJhc19rbGluZy53ZWJtIiwiaWF0IjoxNzc3MTM2NDc5LCJleHAiOjE4MDg2NzI0Nzl9.l3XwgbMhwiRaznb8ITxY_HzHIVhOp50ZKD2vMz7sEvo',

    /** Showcase 3 — "Calidad que se Ve" (producto en estudio) */
    producto: 'https://mvvmmewieigfslvqroia.supabase.co/storage/v1/object/sign/public_203/gorras_profesional.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83OTE2ZWYzYi01NjJhLTQzMTQtODZhYy1kNTliMTQ3OGVkYzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwdWJsaWNfMjAzL2dvcnJhc19wcm9mZXNpb25hbC53ZWJtIiwiaWF0IjoxNzc3MTM2NDg4LCJleHAiOjE4MDg2NzI0ODh9.RcR_p0T3hIbMjGO8Yy_inF2TexvWbP_YKPXUP_hU5dk',

    /** Showcase 4 — "Una para Cada Día" (variedad de estilos) */
    variedad: 'https://mvvmmewieigfslvqroia.supabase.co/storage/v1/object/sign/public_203/gorras_diferente.webm?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83OTE2ZWYzYi01NjJhLTQzMTQtODZhYy1kNTliMTQ3OGVkYzMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwdWJsaWNfMjAzL2dvcnJhc19kaWZlcmVudGUud2VibSIsImlhdCI6MTc3NzEzNjQ2OSwiZXhwIjoxODA4NjcyNDY5fQ.lVwqhE2PEc7KYSssVxInY14pxud4xwjIz3veg5BAudk',
} as const;
