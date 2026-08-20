-- ============================================================
-- Varadero Taxi Tour — migración inicial a Supabase
-- Contenido + comentarios + fotos (bucket público)
-- ============================================================

-- ---------- Tabla: settings (1 fila, todo el contenido) ----------
create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  seo_title text,
  seo_description text,
  whatsapp_number text not null,
  whatsapp_message text,
  phone_display text,
  instagram_url text,
  hero_eyebrow text,
  hero_title text,
  hero_lead text,
  hero_note text,
  hero_image_url text,
  about_quote text,
  about_text text,
  about_image_url text,
  trust_items jsonb not null default '[]'::jsonb,
  routes jsonb not null default '[]'::jsonb,
  cta_eyebrow text,
  cta_title text,
  cta_lead text,
  footer_tagline text,
  footer_copyright text,
  updated_at timestamptz not null default now()
);

-- ---------- Tabla: comments ----------
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 60),
  message text not null check (char_length(message) between 2 and 1000),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Exponer tablas al Data API ----------
grant usage on schema public to anon, authenticated;
grant select on public.settings to anon, authenticated;
grant select, insert, update, delete on public.comments to anon, authenticated;
grant usage, select on sequence public.comments_id_seq to anon, authenticated;

-- ---------- RLS ----------
alter table public.settings enable row level security;
alter table public.comments enable row level security;

-- settings: lectura pública (la usa el build), edición solo usuarios autenticados (admin)
create policy "settings_select_public" on public.settings
  for select to anon, authenticated using (true);

create policy "settings_update_admin" on public.settings
  for update to authenticated using (true) with check (true);

-- comments: solo se ven aprobados; cualquiera puede escribir (sin auto-aprobarse);
-- moderación (update/delete) solo para usuarios autenticados
create policy "comments_select_approved" on public.comments
  for select to anon, authenticated using (approved = true);

create policy "comments_insert_public" on public.comments
  for insert to anon, authenticated with check (approved = false);

create policy "comments_update_admin" on public.comments
  for update to authenticated using (true) with check (true);

create policy "comments_delete_admin" on public.comments
  for delete to authenticated using (true);

-- ---------- Bucket de fotos (público) ----------
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

create policy "fotos_select_public" on storage.objects
  for select to anon using (bucket_id = 'fotos');

create policy "fotos_select_auth" on storage.objects
  for select to authenticated using (bucket_id = 'fotos');

create policy "fotos_upload_auth" on storage.objects
  for insert to authenticated with check (bucket_id = 'fotos');

create policy "fotos_update_auth" on storage.objects
  for update to authenticated using (bucket_id = 'fotos') with check (bucket_id = 'fotos');

create policy "fotos_delete_auth" on storage.objects
  for delete to authenticated using (bucket_id = 'fotos');

-- ---------- Seed: contenido inicial ----------
insert into public.settings (
  id, seo_title, seo_description, whatsapp_number, whatsapp_message, phone_display,
  instagram_url, hero_eyebrow, hero_title, hero_lead, hero_note, about_quote, about_text,
  trust_items, routes, cta_eyebrow, cta_title, cta_lead, footer_tagline, footer_copyright
) values (
  1,
  'Varadero Taxi Tour — Taxi privado, traslados y excursiones en Varadero',
  'Servicio de taxi privado en Varadero, Cuba. Traslados desde el aeropuerto, excursiones a La Habana y paseos personalizados por la península en convertibles de época.',
  '5356202733',
  'Hola! Quisiera reservar un traslado o excursión con Varadero Taxi Tour.',
  '+53 5 620 2733',
  'https://www.instagram.com/michael.taxipremium?igsh=MWVvbzh3Nm0xMHRjYw==',
  'Taxi privado · Varadero, Cuba',
  'Tu aventura cubana empieza en un convertible de época.',
  'Traslados cómodos y seguros desde el aeropuerto, viajes a La Habana y las mejores excursiones personalizadas por la península y sus alrededores. No solo te llevamos a tu destino: te mostramos los secretos de la isla.',
  'Servicio 100% personalizado · Respuesta rápida por WhatsApp',
  'No solo te llevamos a tu destino, te mostramos los secretos de la isla.',
  '¿Necesitas un taxi para una excursión a La Habana? ¿Un traslado desde el aeropuerto? ¿O quizás un paseo por los rincones más mágicos de la península? Nosotros nos encargamos de todo, para que disfrutes de un servicio pensado a tu medida.',
  '[{"icon": "clock", "title": "Puntualidad", "text": "Reserva con antelación y olvídate de esperar."}, {"icon": "car", "title": "Autos impecables", "text": "Vive la experiencia al aire libre en nuestros convertibles de época."}, {"icon": "check", "title": "Tarifas claras", "text": "Precios justos, sin sorpresas ni recargos ocultos."}]'::jsonb,
  '[{"icon": "plane", "title": "Traslado Aeropuerto Varadero", "description": "Te recogemos o te llevamos al aeropuerto con puntualidad garantizada, sin esperas ni sorpresas.", "priceFrom": 65, "priceTo": 85}, {"icon": "wave", "title": "Cuevas de Saturno + Snorkel o Buceo", "description": "Un chapuzón en el cenote de Cuevas de Saturno y snorkel o buceo en las aguas de Playa Coral.", "priceFrom": 65, "priceTo": 85}, {"icon": "landmark", "title": "Excursión a Matanzas", "description": "Cuevas de Bellamar, centro histórico, Bulevar, Museo Farmacéutico, Teatro Sauto, Museo de Bomberos y Parque Libertad.", "priceFrom": 85, "priceTo": 105}, {"icon": "flag", "title": "Excursión a La Habana", "description": "Plaza de la Revolución, paseo por el Malecón, recorrido por La Habana Vieja, Fábrica de Tabacos y visita al Morro-Cabaña.", "priceFrom": 125, "priceTo": 155}, {"icon": "palm", "title": "Excursión por Varadero", "description": "Casa Dupont y campo de golf, Peñón del Fraile, Bulevar, Bar Beatles, Parque Josoné, Bar Floridita, cervecería, mirador de calle 30 y feria de artesanía.", "priceFrom": 35, "priceTo": 55}, {"icon": "dolphin", "title": "Delfinario", "description": "Visita con espera incluida: show de delfines, fotografías y paseo en camellos.", "priceFrom": 15, "priceTo": 25}, {"icon": "pin", "title": "Bulevar de la Marina", "description": "Recorrido y estancia de 1 a 3 horas: bolos, billar, tiendas y restaurantes.", "priceFrom": 25, "priceTo": 35}, {"icon": "glass", "title": "Bares y restaurantes", "description": "Te sugerimos los mejores lugares, con estancia de 2 a 3 horas y espera incluida.", "priceFrom": 15, "priceTo": 25}]'::jsonb,
  'Listo para una experiencia única',
  'Contacta, reserva y relájate: tu aventura cubana empieza aquí.',
  'Haz tu reserva ahora y asegura tus traslados y paseos en Varadero con el mejor precio y la máxima comodidad.',
  'Taxi privado y excursiones en Varadero, Cuba.',
  'Varadero Taxi Tour. Hecho con cariño en la península.'
)
on conflict (id) do nothing;