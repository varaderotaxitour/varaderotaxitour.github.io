import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr', 'de', 'it', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    domains: ['bwhpeoppgexwaqphozdq.supabase.co'],
  },
});