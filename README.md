# Viclu Store — Catálogo de Gorras Premium

E-commerce catalog con panel admin para **Viclu Store**. Stack:

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL + Auth)
- **React Router 7**
- **Lucide React** (iconos)

El flujo de compra actual es por **WhatsApp** — cada producto genera un link pre-formateado hacia el número configurado.

---

## 🚀 Setup inicial

### 1. Clonar + instalar

```bash
git clone https://github.com/isaias-sanchez/viclu-store-2.0.git
cd viclu-store-2.0
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Luego editá `.env.local` con tus credenciales:

| Variable | Dónde obtenerla |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` / `public` key |
| `VITE_WHATSAPP_PHONE` | Tu número con código de país, sin `+` (ej. `573155928724`) |
| `VITE_INSTAGRAM_URL` | URL completa de tu perfil de Instagram |

### 3. Configurar Supabase

#### 3.1 Tabla `products`

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  brand text not null,
  price numeric not null,
  category text not null,
  stock int not null default 0,
  description text,
  color text,
  active boolean default true,
  image text
);
```

#### 3.2 Crear usuario admin

En el dashboard de Supabase → **Authentication → Users → Add user**:
- Invitá un email + password para el propietario del catálogo
- Ese usuario podrá entrar a `/admin` con esas credenciales

#### 3.3 Row Level Security (RLS)

**Paso crítico** — sin esto cualquiera podría modificar tu inventario:

```sql
alter table products enable row level security;

-- Lectura pública del catálogo
create policy "Public can read products"
  on products for select
  using (true);

-- Solo usuarios autenticados pueden modificar
create policy "Authenticated can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Authenticated can update products"
  on products for update
  to authenticated
  using (true);

create policy "Authenticated can delete products"
  on products for delete
  to authenticated
  using (true);
```

### 4. Correr en dev

```bash
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Scripts

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Build de producción (genera ./dist)
npm run preview   # Preview del build
npm run lint      # ESLint check
```

---

## 📂 Estructura

```
src/
├── App.tsx                 Router principal (Catalog + Admin)
├── components/
│   ├── Hero.tsx            Hero con video de fondo
│   ├── VideoShowcase.tsx   Secciones narrativas con videos scroll-triggered
│   ├── FilterBar.tsx       Filtro por categoría
│   ├── Layout.tsx          Wrapper nav/footer
│   ├── ProductCard.tsx     Tarjeta con CTA WhatsApp
│   └── ProductForm.tsx     Form admin
├── pages/
│   └── Admin.tsx           Panel admin (auth vía Supabase)
├── hooks/
│   └── useProducts.ts      CRUD contra Supabase
├── lib/
│   ├── supabaseClient.ts   Cliente Supabase (lee env vars)
│   ├── constants.ts        Config de marca
│   └── utils.ts            cn, formatPrice, WhatsApp link, base64
├── types/product.ts        Interface Product
└── data/products.ts        Seed data (fallback)

public/videos/
├── hero.webm               Video de fondo del Hero
├── lifestyle-calle.webm    Video 1 — narrativa urbana
├── producto-studio.webm    Video 2 — calidad del producto
└── variedad.webm           Video 3 — variedad de estilos
```

---

## 🔐 Seguridad

- **Autenticación admin** via Supabase Auth (no password hardcoded)
- **Credenciales en `.env.local`** (nunca commitear)
- **RLS habilitado** en la tabla `products` (lectura pública, escritura restringida)

Para rotar la anon key de Supabase: Dashboard → Settings → API → `Reset` y actualizar `.env.local`.

---

## 🎬 Videos

Los videos `.webm` en `public/videos/` se cargan perezosamente y sólo se reproducen cuando entran en viewport (via `IntersectionObserver`). No afectan el LCP porque sólo `hero.webm` tiene `preload="auto"`; el resto usa `preload="metadata"`.

Para reemplazar un video, simplemente sustituí el archivo en `public/videos/` manteniendo el mismo nombre.

---

## 📦 Deploy

Cualquier host estático funciona (Vercel, Netlify, Cloudflare Pages). Configurá las mismas env vars que `.env.local` en el dashboard del host.

```bash
npm run build
# sube ./dist al host, o conectá el repo y configurá env vars
```

---

## 📱 Contacto de compra

Las compras se gestionan por **WhatsApp**. Cada `ProductCard` genera un link `wa.me/<phone>?text=...` con el nombre del producto y precio pre-cargados.
