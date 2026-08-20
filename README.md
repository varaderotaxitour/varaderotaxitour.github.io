# Varadero Taxi Tour — Frontend (Astro + Sanity CMS)

Landing page de una sola página para el servicio de taxi privado y excursiones
en Varadero, Cuba. Todo el contenido se edita desde Sanity CMS.

## Cómo correrlo

```bash
pnpm install
cp .env.example .env   # rellena PUBLIC_SANITY_PROJECT_ID (nveap59g) y PUBLIC_SANITY_DATASET
pnpm dev
```

Abre `http://localhost:4321`.

## Panel de administración (Sanity Studio)

El panel vive embebido en tu propio sitio:

- **Local:** `http://localhost:4321/admin`
- **Producción:** `https://varadero-taxi-tour.vercel.app/admin`

Ahí editas todo el contenido: contacto (WhatsApp/Instagram/teléfono), hero,
sección nosotros, rutas y precios, CTA y footer.

### Importante

- **Publicar:** al editar en el Studio, los cambios se guardan como
  **borrador**. Para que aparezcan en la web hay que pulsar el botón
  **"Publish"** del documento.
- **En dev** (`pnpm dev`): además del contenido publicado, se muestran los
  **borradores** (si `SANITY_API_READ_TOKEN` está definido), por lo que verás
  los cambios sin necesidad de publicar. En el **build de producción** solo se
  usa el contenido publicado.
- El sitio es **estático**: al publicar contenido, hay que **re-desplegar**
  (`pnpm build`) para que los cambios aparezcan en producción. El contenido
  se descarga de Sanity durante el build. Si Sanity no responde, la página usa
  el contenido de respaldo definido en `src/pages/index.astro` (fallback).

## Configuración de producción (pendiente)

1. **Desplegar el sitio** en Vercel o Netlify con las variables
   `PUBLIC_SANITY_PROJECT_ID=nveap59g` y `PUBLIC_SANITY_DATASET=production`.
2. **CORS:** en manage.sanity.io → API → CORS origins, añadir el dominio de
   producción (con credenciales) para que el Studio embebido funcione.
   `http://localhost:4321` ya está añadido.
3. **Webhook de rebuild:** en manage.sanity.io → API → Webhooks (o con el CLI:
   `pnpm sanity hooks create`), crear un webhook apuntando al deploy hook de tu
   hosting (Vercel/Netlify), para que cada publicación en Sanity re-despliegue
   el sitio automáticamente.
4. **Rewrite de `/admin`:** el Studio es una SPA con rutas internas
   (ej. `/admin/structure`). En hostings estáticos, refrescar una sub-ruta
   puede dar 404; configura un rewrite que dirija `/admin/*` a `/admin`
   (Vercel: `rewrites` en `vercel.json`; Netlify: `_redirects`).

## Schema de contenido

El schema vive en `sanity.config.ts` (documento singleton `siteSettings`).
Para migrar contenido inicial al CMS:

```bash
pnpm seed
```

Esto crea/actualiza el documento `siteSettings` con el contenido de
`scripts/seed-siteSettings.json`.

## Estructura

```
sanity.config.ts          # Configuración y schema del Studio
sanity.cli.ts             # Config CLI de Sanity
scripts/seed-siteSettings.json  # Contenido inicial para el seed
src/
  layouts/Layout.astro    # <head>, fuentes (Fredoka + Work Sans), meta tags
  components/Icon.astro   # Iconos SVG reutilizables
  pages/index.astro       # Página (consume Sanity con fallback local)
  styles/global.css       # Paleta, tipografía y estilos base
public/
  logo.png                # Logo
```

## Paleta e identidad

Tomada directamente del logo: azul-verdoso profundo (`--teal-deep`),
turquesa de costa (`--turquoise`), dorado de concha (`--gold`) y arena
(`--sand`), sobre un fondo crema. Tipografía display **Fredoka** (redondeada,
como el rótulo del logo) + **Work Sans** para el cuerpo de texto.

El elemento distintivo de la página es la sección "Rutas & precios": los
servicios se presentan como paradas a lo largo de una línea punteada, como
una carretera costera — coherente con ser literalmente un servicio de tours
en carretera.