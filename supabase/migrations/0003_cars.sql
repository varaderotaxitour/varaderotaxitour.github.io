-- ============================================================
-- Varadero Taxi Tour — Carros disponibles
-- Tabla cars + RLS + trigger de redeploy
-- ============================================================

-- ---------- Tabla: cars ----------
create table if not exists public.cars (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 80),
  description text not null check (char_length(description) between 2 and 1000),
  details text check (details is null or char_length(details) <= 200),
  photos text[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cars_active_sort_idx
  on public.cars (is_active, sort_order, created_at desc)
  where is_active = true;

create index if not exists cars_sort_idx
  on public.cars (sort_order, created_at desc);

-- ---------- updated_at trigger ----------
create or replace function public.handle_cars_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cars_updated_at on public.cars;
create trigger cars_updated_at
  before update on public.cars
  for each row
  execute function public.handle_cars_updated_at();

-- ---------- RLS ----------
alter table public.cars enable row level security;

drop policy if exists "cars_select_public" on public.cars;
create policy "cars_select_public" on public.cars
  for select to anon, authenticated using (is_active = true);

drop policy if exists "cars_select_admin" on public.cars;
create policy "cars_select_admin" on public.cars
  for select to authenticated using (true);

drop policy if exists "cars_insert_admin" on public.cars;
create policy "cars_insert_admin" on public.cars
  for insert to authenticated with check (true);

drop policy if exists "cars_update_admin" on public.cars;
create policy "cars_update_admin" on public.cars
  for update to authenticated using (true) with check (true);

drop policy if exists "cars_delete_admin" on public.cars;
create policy "cars_delete_admin" on public.cars
  for delete to authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select on public.cars to anon, authenticated;
grant select, insert, update, delete on public.cars to authenticated;
grant usage, select on sequence public.cars_id_seq to authenticated;

-- Exponer al Data API (PostgREST) si no está ya)
-- (anon ya tiene select vía policy cars_select_public)

-- ---------- Redeploy trigger (genérico) ----------
-- Actualiza notify_redeploy para que use TG_TABLE_NAME y soporte DELETE
create or replace function public.notify_redeploy()
returns trigger
language plpgsql
as $$
declare
  req_id bigint;
  src text;
begin
  src := TG_TABLE_NAME;
  -- net.http_post es async (pg_net), no bloquea la transacción
  select net.http_post(
    url := '<FUNCTION_URL>',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-redeploy-secret', '<SHARED_SECRET>'
    ),
    body := jsonb_build_object('event_type', 'content_updated', 'source', src)
  ) into req_id;
  -- Para DELETE, NEW es null; debemos retornar OLD
  if TG_OP = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke execute on function public.notify_redeploy() from public, anon, authenticated;

-- Re-crear trigger de settings (por si la función cambió)
drop trigger if exists settings_updated on public.settings;
create trigger settings_updated
  after update on public.settings
  for each row
  when (old is distinct from new)
  execute function public.notify_redeploy();

-- Trigger para cars (insert/update/delete)
drop trigger if exists cars_redeploy on public.cars;
create trigger cars_redeploy
  after insert or update or delete on public.cars
  for each row
  execute function public.notify_redeploy();

-- ---------- Seed opcional (desactivado por defecto) ----------
-- Descomenta si quieres un carro de ejemplo:
-- insert into public.cars (name, description, details, photos, is_active, sort_order)
-- values (
--   'Chevrolet Impala 1958 Convertible',
--   'Clásico americano impecable, capota descapotable, ideal para fotos y paseos por la costa.',
--   '4 pax · Convertible · A/C · 1958',
--   '{}',
--   true,
--   0
-- ) on conflict do nothing;
