-- ============================================================
-- Varadero Taxi Tour — Rutas y servicios
-- Tabla routes + RLS + triggers (updated_at y redeploy)
--
-- NOTA: esta migración se aplicó directamente en el proyecto
-- remoto antes de guardarse en el repo. Se documenta aquí con
-- el esquema exacto extraído de la BD para poder recrear el
-- proyecto desde cero.
-- ============================================================

-- ---------- Tabla: routes ----------
create table if not exists public.routes (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 2 and 80),
  description text not null check (char_length(description) between 2 and 1000),
  icon text not null default 'pin' check (char_length(icon) between 2 and 30),
  price_from integer not null default 0 check (price_from >= 0),
  price_to integer not null default 0 check (price_to >= 0),
  photos text[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists routes_active_sort_idx
  on public.routes (is_active, sort_order, created_at)
  where is_active = true;

create index if not exists routes_sort_idx
  on public.routes (sort_order, created_at);

-- ---------- updated_at trigger ----------
create or replace function public.handle_routes_updated_at()
returns trigger
language plpgsql
security definer
set search_path to 'public', 'extensions'
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists routes_updated_at on public.routes;
create trigger routes_updated_at
  before update on public.routes
  for each row
  execute function public.handle_routes_updated_at();

-- ---------- RLS ----------
alter table public.routes enable row level security;

drop policy if exists "routes_select_public" on public.routes;
create policy "routes_select_public" on public.routes
  for select to anon using (is_active = true);

drop policy if exists "routes_select_admin" on public.routes;
create policy "routes_select_admin" on public.routes
  for select to authenticated using (true);

drop policy if exists "routes_insert_admin" on public.routes;
create policy "routes_insert_admin" on public.routes
  for insert to authenticated with check (true);

drop policy if exists "routes_update_admin" on public.routes;
create policy "routes_update_admin" on public.routes
  for update to authenticated using (true) with check (true);

drop policy if exists "routes_delete_admin" on public.routes;
create policy "routes_delete_admin" on public.routes
  for delete to authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select on public.routes to anon, authenticated;
grant select, insert, update, delete on public.routes to authenticated;
grant usage, select on sequence public.routes_id_seq to authenticated;

-- ---------- Trigger de redeploy ----------
-- Reutiliza notify_redeploy() creada en 0003_cars.sql
drop trigger if exists routes_redeploy on public.routes;
create trigger routes_redeploy
  after insert or update or delete on public.routes
  for each row
  execute function public.notify_redeploy();

-- ---------- Seed opcional (desactivado por defecto) ----------
-- Descomenta si quieres una ruta de ejemplo:
-- insert into public.routes (title, description, icon, price_from, price_to, photos, is_active, sort_order)
-- values (
--   'Traslado Aeropuerto Varadero',
--   'Te recogemos o te llevamos al aeropuerto con puntualidad garantizada.',
--   'plane',
--   65,
--   85,
--   '{}',
--   true,
--   0
-- ) on conflict do nothing;
