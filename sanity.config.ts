import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

const iconOptions = [
  { value: 'plane', title: 'Avión' },
  { value: 'wave', title: 'Olas' },
  { value: 'landmark', title: 'Monumento' },
  { value: 'flag', title: 'Bandera' },
  { value: 'palm', title: 'Palmera' },
  { value: 'dolphin', title: 'Delfín' },
  { value: 'pin', title: 'Ubicación' },
  { value: 'glass', title: 'Copa' },
  { value: 'whatsapp', title: 'WhatsApp' },
  { value: 'instagram', title: 'Instagram' },
  { value: 'phone', title: 'Teléfono' },
  { value: 'check', title: 'Verificado' },
  { value: 'clock', title: 'Reloj' },
  { value: 'car', title: 'Auto' },
];

const trustItem = {
  name: 'trustItem',
  title: 'Punto de confianza',
  type: 'object',
  fields: [
    {
      name: 'icon',
      title: 'Icono',
      type: 'string',
      options: { list: iconOptions },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'text',
      title: 'Texto',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
  ],
};

const routeItem = {
  name: 'routeItem',
  title: 'Ruta / Servicio',
  type: 'object',
  fields: [
    {
      name: 'icon',
      title: 'Icono',
      type: 'string',
      options: { list: iconOptions },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'priceFrom',
      title: 'Precio desde (USD/EUR)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'priceTo',
      title: 'Precio hasta (USD/EUR)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
  ],
};

const siteSettings = {
  name: 'siteSettings',
  title: 'Ajustes del sitio',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'contacto', title: 'Contacto' },
    { name: 'hero', title: 'Hero' },
    { name: 'nosotros', title: 'Nosotros' },
    { name: 'rutas', title: 'Rutas y precios' },
    { name: 'cta', title: 'CTA final' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    {
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
      group: 'seo',
    },
    {
      name: 'seoDescription',
      title: 'Descripción SEO',
      type: 'text',
      rows: 3,
      group: 'seo',
    },
    {
      name: 'whatsappNumber',
      title: 'Número de WhatsApp',
      description: 'Solo dígitos, con código de país. Ej: 5356202733',
      type: 'string',
      group: 'contacto',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'whatsappMessage',
      title: 'Mensaje precargado de WhatsApp',
      type: 'string',
      group: 'contacto',
    },
    {
      name: 'phoneDisplay',
      title: 'Teléfono (mostrado en pantalla)',
      type: 'string',
      group: 'contacto',
    },
    {
      name: 'instagramUrl',
      title: 'URL de Instagram',
      type: 'url',
      group: 'contacto',
    },
    {
      name: 'heroEyebrow',
      title: 'Eyebrow (etiqueta superior)',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'heroTitle',
      title: 'Título principal',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'heroLead',
      title: 'Texto de introducción',
      type: 'text',
      rows: 4,
      group: 'hero',
    },
    {
      name: 'heroNote',
      title: 'Nota bajo los botones',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'aboutQuote',
      title: 'Cita de la sección Nosotros',
      type: 'string',
      group: 'nosotros',
    },
    {
      name: 'aboutText',
      title: 'Texto de la sección Nosotros',
      type: 'text',
      rows: 4,
      group: 'nosotros',
    },
    {
      name: 'trustItems',
      title: 'Puntos de confianza',
      type: 'array',
      of: [{ type: 'trustItem' }],
      group: 'nosotros',
    },
    {
      name: 'routes',
      title: 'Rutas y servicios',
      description:
        'El orden de esta lista es el orden de aparición en la página.',
      type: 'array',
      of: [{ type: 'routeItem' }],
      group: 'rutas',
    },
    {
      name: 'ctaEyebrow',
      title: 'Eyebrow (etiqueta superior)',
      type: 'string',
      group: 'cta',
    },
    {
      name: 'ctaTitle',
      title: 'Título',
      type: 'string',
      group: 'cta',
    },
    {
      name: 'ctaLead',
      title: 'Texto de introducción',
      type: 'text',
      rows: 3,
      group: 'cta',
    },
    {
      name: 'footerTagline',
      title: 'Frase del footer',
      type: 'string',
      group: 'footer',
    },
    {
      name: 'footerCopyright',
      title: 'Texto de copyright (sin año)',
      description: 'El año se añade automáticamente delante.',
      type: 'string',
      group: 'footer',
    },
  ],
};

export default defineConfig({
  name: 'varadero-taxi-tour',
  title: 'Varadero Taxi Tour',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem()
              .title('Ajustes del sitio')
              .id('siteSettings')
              .child(
                S.editor()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ]),
    }),
  ],
  schema: {
    types: [siteSettings, trustItem, routeItem],
  },
});