import { createClient } from '@supabase/supabase-js';
import { defaultLocale, type Locale } from '../i18n/ui';

export type TrustItem = { icon: string; title: string; text: string };

export type RouteFallback = {
  icon: string;
  title: string;
  description: string;
  priceFrom: number;
  priceTo: number;
};

export type SiteContent = {
  seoTitle: string;
  seoDescription: string;
  whatsappNumber: string;
  whatsappMessage: string;
  phoneDisplay: string;
  instagramUrl: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroNote: string;
  heroImageUrl: string | null;
  aboutQuote: string;
  aboutText: string;
  aboutImageUrl: string | null;
  trustItems: TrustItem[];
  routes: RouteFallback[];
  ctaEyebrow: string;
  ctaTitle: string;
  ctaLead: string;
  footerTagline: string;
  footerCopyright: string;
};

export type Stop = {
  icon: string;
  title: string;
  desc: string;
  price: string;
  photos: string[];
};

export type CarView = {
  id: number;
  name: string;
  description: string;
  details: string | null;
  photos: string[];
};

export const fallback: SiteContent = {
  seoTitle:
    'Varadero Taxi Tour — Taxi privado, traslados y excursiones en Varadero',
  seoDescription:
    'Servicio de taxi privado en Varadero, Cuba. Traslados desde el aeropuerto, excursiones a La Habana y paseos personalizados por la península en convertibles de época.',
  whatsappNumber: '5356202733',
  whatsappMessage:
    'Hola! Quisiera reservar un traslado o excursión con Varadero Taxi Tour.',
  phoneDisplay: '+53 5 620 2733',
  instagramUrl:
    'https://www.instagram.com/michael.taxipremium?igsh=MWVvbzh3Nm0xMHRjYw==',
  heroEyebrow: 'Taxi privado · Varadero, Cuba',
  heroTitle: 'Tu aventura cubana empieza en un convertible de época.',
  heroLead:
    'Traslados cómodos y seguros desde el aeropuerto, viajes a La Habana y las mejores excursiones personalizadas por la península y sus alrededores. No solo te llevamos a tu destino: te mostramos los secretos de la isla.',
  heroNote: 'Servicio 100% personalizado · Respuesta rápida por WhatsApp',
  aboutQuote:
    'No solo te llevamos a tu destino, te mostramos los secretos de la isla.',
  aboutText:
    '¿Necesitas un taxi para una excursión a La Habana? ¿Un traslado desde el aeropuerto? ¿O quizás un paseo por los rincones más mágicos de la península? Nosotros nos encargamos de todo, para que disfrutes de un servicio pensado a tu medida.',
  trustItems: [
    { icon: 'clock', title: 'Puntualidad', text: 'Reserva con antelación y olvídate de esperar.' },
    { icon: 'car', title: 'Autos impecables', text: 'Vive la experiencia al aire libre en nuestros convertibles de época.' },
    { icon: 'check', title: 'Tarifas claras', text: 'Precios justos, sin sorpresas ni recargos ocultos.' },
  ],
  routes: [
    {
      icon: 'plane',
      title: 'Traslado Aeropuerto Varadero',
      description: 'Te recogemos o te llevamos al aeropuerto con puntualidad garantizada, sin esperas ni sorpresas.',
      priceFrom: 65,
      priceTo: 85,
    },
    {
      icon: 'wave',
      title: 'Cuevas de Saturno + Snorkel o Buceo',
      description: 'Un chapuzón en el cenote de Cuevas de Saturno y snorkel o buceo en las aguas de Playa Coral.',
      priceFrom: 65,
      priceTo: 85,
    },
    {
      icon: 'landmark',
      title: 'Excursión a Matanzas',
      description: 'Cuevas de Bellamar, centro histórico, Bulevar, Museo Farmacéutico, Teatro Sauto, Museo de Bomberos y Parque Libertad.',
      priceFrom: 85,
      priceTo: 105,
    },
    {
      icon: 'flag',
      title: 'Excursión a La Habana',
      description: 'Plaza de la Revolución, paseo por el Malecón, recorrido por La Habana Vieja, Fábrica de Tabacos y visita al Morro-Cabaña.',
      priceFrom: 125,
      priceTo: 155,
    },
    {
      icon: 'palm',
      title: 'Excursión por Varadero',
      description: 'Casa Dupont y campo de golf, Peñón del Fraile, Bulevar, Bar Beatles, Parque Josoné, Bar Floridita, cervecería, mirador de calle 30 y feria de artesanía.',
      priceFrom: 35,
      priceTo: 55,
    },
    {
      icon: 'dolphin',
      title: 'Delfinario',
      description: 'Visita con espera incluida: show de delfines, fotografías y paseo en camellos.',
      priceFrom: 15,
      priceTo: 25,
    },
    {
      icon: 'pin',
      title: 'Bulevar de la Marina',
      description: 'Recorrido y estancia de 1 a 3 horas: bolos, billar, tiendas y restaurantes.',
      priceFrom: 25,
      priceTo: 35,
    },
    {
      icon: 'glass',
      title: 'Bares y restaurantes',
      description: 'Te sugerimos los mejores lugares, con estancia de 2 a 3 horas y espera incluida.',
      priceFrom: 15,
      priceTo: 25,
    },
  ],
  ctaEyebrow: 'Listo para una experiencia única',
  ctaTitle: 'Contacta, reserva y relájate: tu aventura cubana empieza aquí.',
  ctaLead:
    'Haz tu reserva ahora y asegura tus traslados y paseos en Varadero con el mejor precio y la máxima comodidad.',
  footerTagline: 'Taxi privado y excursiones en Varadero, Cuba.',
  footerCopyright: 'Varadero Taxi Tour. Hecho con cariño en la península.',
};

type Translations = Record<string, Record<string, unknown>> | null | undefined;

function pickString(
  translations: Translations,
  locale: Locale,
  field: string,
  esValue: string | null | undefined
): string {
  if (locale !== defaultLocale) {
    const value = translations?.[locale]?.[field];
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return (esValue as string) ?? '';
}

function pickArray<T>(
  translations: Translations,
  locale: Locale,
  field: string,
  esValue: T[]
): T[] {
  if (locale !== defaultLocale) {
    const value = translations?.[locale]?.[field];
    if (Array.isArray(value)) return value as T[];
  }
  return esValue;
}

function resolveTrustItems(
  base: TrustItem[],
  translations: Translations,
  locale: Locale
): TrustItem[] {
  if (locale === defaultLocale) return base;
  const trArr = translations?.[locale]?.trust_items;
  if (!Array.isArray(trArr)) return base;
  return base.map((item, i) => {
    const trItem = trArr[i] as Partial<TrustItem> | undefined;
    const title =
      typeof trItem?.title === 'string' && trItem.title.trim() !== ''
        ? trItem.title
        : item.title;
    const text =
      typeof trItem?.text === 'string' && trItem.text.trim() !== ''
        ? trItem.text
        : item.text;
    return { icon: item.icon, title, text };
  });
}

function rowToContent(row: any): SiteContent {
  return {
    seoTitle: row.seo_title ?? '',
    seoDescription: row.seo_description ?? '',
    whatsappNumber: row.whatsapp_number,
    whatsappMessage: row.whatsapp_message ?? '',
    phoneDisplay: row.phone_display ?? '',
    instagramUrl: row.instagram_url ?? '',
    heroEyebrow: row.hero_eyebrow ?? '',
    heroTitle: row.hero_title ?? '',
    heroLead: row.hero_lead ?? '',
    heroNote: row.hero_note ?? '',
    heroImageUrl: row.hero_image_url,
    aboutQuote: row.about_quote ?? '',
    aboutText: row.about_text ?? '',
    aboutImageUrl: row.about_image_url,
    trustItems: row.trust_items ?? [],
    routes: row.routes ?? [],
    ctaEyebrow: row.cta_eyebrow ?? '',
    ctaTitle: row.cta_title ?? '',
    ctaLead: row.cta_lead ?? '',
    footerTagline: row.footer_tagline ?? '',
    footerCopyright: row.footer_copyright ?? '',
  };
}

function resolveContent(
  row: any | null,
  translations: Translations,
  locale: Locale
): SiteContent {
  const base: SiteContent = row ? { ...fallback, ...rowToContent(row) } : fallback;
  return {
    ...base,
    seoTitle: pickString(translations, locale, 'seo_title', base.seoTitle),
    seoDescription: pickString(translations, locale, 'seo_description', base.seoDescription),
    whatsappMessage: pickString(translations, locale, 'whatsapp_message', base.whatsappMessage),
    heroEyebrow: pickString(translations, locale, 'hero_eyebrow', base.heroEyebrow),
    heroTitle: pickString(translations, locale, 'hero_title', base.heroTitle),
    heroLead: pickString(translations, locale, 'hero_lead', base.heroLead),
    heroNote: pickString(translations, locale, 'hero_note', base.heroNote),
    aboutQuote: pickString(translations, locale, 'about_quote', base.aboutQuote),
    aboutText: pickString(translations, locale, 'about_text', base.aboutText),
    trustItems: resolveTrustItems(base.trustItems, translations, locale),
    routes: pickArray(translations, locale, 'routes', base.routes),
    ctaEyebrow: pickString(translations, locale, 'cta_eyebrow', base.ctaEyebrow),
    ctaTitle: pickString(translations, locale, 'cta_title', base.ctaTitle),
    ctaLead: pickString(translations, locale, 'cta_lead', base.ctaLead),
    footerTagline: pickString(translations, locale, 'footer_tagline', base.footerTagline),
    footerCopyright: pickString(translations, locale, 'footer_copyright', base.footerCopyright),
  };
}

function resolveRouteRow(row: any, locale: Locale) {
  const t = row.translations as Translations;
  return {
    icon: row.icon as string,
    title: pickString(t, locale, 'title', row.title),
    desc: pickString(t, locale, 'description', row.description),
    price: `${row.price_from} – ${row.price_to}`,
    photos: (row.photos ?? []) as string[],
  };
}

function resolveFallbackRoute(route: RouteFallback): Stop {
  return {
    icon: route.icon,
    title: route.title,
    desc: route.description,
    price: `${route.priceFrom} – ${route.priceTo}`,
    photos: [],
  };
}

function resolveCar(row: any, locale: Locale): CarView {
  const t = row.translations as Translations;
  return {
    id: row.id,
    name: pickString(t, locale, 'name', row.name),
    description: pickString(t, locale, 'description', row.description),
    details: row.details
      ? pickString(t, locale, 'details', row.details)
      : null,
    photos: (row.photos ?? []) as string[],
  };
}

export async function loadSiteData(locale: Locale): Promise<{
  content: SiteContent;
  cars: CarView[];
  stops: Stop[];
}> {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

  let content = resolveContent(null, null, locale);
  let cars: CarView[] = [];
  let stops: Stop[] = [];

  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        '[supabase] Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY, usando valores locales.'
      );
      return { content, cars, stops: content.routes.map(resolveFallbackRoute) };
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    content = resolveContent(data, data?.translations, locale);

    const { data: carsData, error: carsError } = await supabase
      .from('cars')
      .select('id, name, description, details, photos, is_active, sort_order, translations')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (!carsError && carsData) cars = carsData.map((car) => resolveCar(car, locale));
    if (carsError)
      console.warn('[supabase] No se pudieron cargar los carros:', carsError.message);

    const { data: routesData, error: routesError } = await supabase
      .from('routes')
      .select('id, title, description, icon, price_from, price_to, photos, translations')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (!routesError && routesData && routesData.length > 0) {
      stops = routesData.map((route) => resolveRouteRow(route, locale));
    } else {
      if (routesError)
        console.warn('[supabase] No se pudieron cargar las rutas:', routesError.message);
      stops = content.routes.map(resolveFallbackRoute);
    }
  } catch (error) {
    console.warn(
      '[supabase] No se pudo cargar el contenido, usando valores locales:',
      error
    );
    stops = content.routes.map(resolveFallbackRoute);
  }

  return { content, cars, stops };
}
