# Product images — 30 October 2026

The public catalog returned 83 products, including 26 created on 29 October
whose `image` column was null. All 57 existing image URLs and the deployed
optimized assets were reachable. The Supabase project was healthy and the
`product-images` bucket was already public.

The missing photographs were present in Storage. They were matched to the
products using the upload sequence, timestamps and a visual review. One repeated
upload was byte-identical. Only the 26 null `image` values were restored, with
an atomic row-count assertion; all 83 products then had image URLs. The mapping
and previous values are kept locally in the ignored
`artifacts/product-images-recovery-2026-10-30.json` for rollback.

The admin form allowed submission during an image upload and cleared its state
before the database insert finished. These are reproducible ways to lose the
photo association or form data; historical evidence does not establish the
exact sequence of clicks behind every affected row.

The form now waits for an uploaded photo, blocks saves during upload or an
existing save, awaits the database result, and clears the form only on success.
Failed saves retain the photo and other fields for retry. These guards apply
to the admin form; direct database imports still need their own validation.

Validation: five component regression tests covering upload completion,
missing photos, rejected saves, duplicate saves and thrown save errors;
production build/TypeScript, lint and SEO checks for 91 indexable pages.
The public storefront displayed the recovered products with loaded images.
