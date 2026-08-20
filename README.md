# Varadero Taxi Tour — Frontend (Astro + Supabase)

Landing page de una sola página para el servicio de taxi privado y excursiones
en Varadero, Cuba. Todo el contenido se edita desde el panel de administración
propio (Supabase: base de datos + auth + storage).

## Cómo correrlo

```bash
pnpm install
cp .env.example .env   # rellena PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY
pnpm dev
```

Abre `http://localhost:4321`.

## Panel de administración

El panel vive en tu propio sitio:

- **Local:** `http://localhost:4321/admin`
- **Producción:** `https://varaderotaxitour.github.io/admin`

Ahí editas todo el contenido: contacto (WhatsApp/Instagram/teléfono), hero,
sección nosotros, rutas y precios, CTA y footer. También moderas los
comentarios de los visitantes (aprobar/ocultar/eliminar) y subes las fotos del
hero y de la sección "Nosotros".

### Acceso

El panel pide login (email + contraseña). El usuario se crea en el dashboard
de Supabase → Authentication → Users → Add user. Importante: solo crea tu
usuario de administración; cualquiera con una cuenta podría editar contenido.

### Importante

- El sitio es **estático**: el contenido se descarga de Supabase durante el
  build (`pnpm build`). Al guardar cambios en el panel hay que **re-desplegar**
  (push a `main` o ejecutar el workflow "Deploy to GitHub Pages") para que
  aparezcan en producción. Si Supabase no responde, la página usa el contenido
  de respaldo definido en `src/pages/index.astro` (fallback).
- Los **comentarios** de los visitantes se guardan en tiempo real: quien
  escribe solo ve su comentario tras ser **aprobado** en el panel.

## Base de datos (Supabase)

- `settings`: una fila con todo el contenido del sitio (textos, rutas y
  precios en JSONB, URLs de fotos).
- `comments`: comentarios de visitantes (`approved` controla la visibilidad).
- Bucket público `fotos`: imágenes del hero y de "Nosotros".

Las políticas RLS permiten: lectura pública de `settings`, lectura pública solo
de comentarios aprobados, inserción anónima de comentarios (sin auto-aprobarse)
y escritura/moderación solo para usuarios autenticados (el admin).

El esquema vive en `supabase/migrations/0001_init.sql`.

## Estructura

```
astro.config.mjs          # Config de Astro
supabase/migrations/      # Esquema de la base de datos
src/
  layouts/Layout.astro    # <head>, fuentes (Fredoka + Work Sans), meta tags
  pages/index.astro       # Página principal (consume Supabase con fallback)
  pages/admin.astro       # Panel de administración
  components/Comments.tsx # Comentarios de visitantes (React)
  components/AdminApp.tsx # Panel: contenido, comentarios, fotos (React)
  components/Icon.astro   # Iconos SVG reutilizables
  styles/global.css       # Paleta, tipografía y estilos base
public/
  logo.png / logo.webp    # Logo
```

## Despliegue

GitHub Pages + GitHub Actions (`.github/workflows/deploy.yml`). Las variables
`PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` están configuradas en las
variables del repo. El workflow además copia `dist/admin/index.html` a
`dist/404.html` para que las sub-rutas del admin no den 404.

## Paleta e identidad

Tomada directamente del logo: azul-verdoso profundo (`--teal-deep`),
turquesa de costa (`--turquoise`), dorado de concha (`--gold`) y arena
(`--sand`), sobre un fondo crema. Tipografía display **Fredoka** (redondeada,
como el rótulo del logo) + **Work Sans** para el cuerpo de texto.

El elemento distintivo de la página es la sección "Rutas & precios": los
servicios se presentan como paradas a lo largo de una línea punteada, como
una carretera costera — coherente con ser literalmente un servicio de tours
en carretera.