-- ============================================================
-- Varadero Taxi Tour — elimina redeploy automático
-- Pasa a publicación manual vía botón "Actualizar página" (/admin)
-- que invoca Edge Function `redeploy` → Vercel Deploy Hook
-- ============================================================

-- Quita triggers automáticos (si existen)
drop trigger if exists settings_updated on public.settings;
drop trigger if exists cars_redeploy on public.cars;
drop trigger if exists routes_redeploy on public.routes;

-- Quita función legacy (placeholder con <FUNCTION_URL>)
drop function if exists public.notify_redeploy() cascade;
drop function if exists public.handle_cars_updated_at() cascade;
drop function if exists public.handle_routes_updated_at() cascade;

-- Recrea solo updated_at sin redeploy (opcional, útil para ordenar)
create or replace function public.handle_cars_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_routes_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
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

drop trigger if exists routes_updated_at on public.routes;
create trigger routes_updated_at
  before update on public.routes
  for each row
  execute function public.handle_routes_updated_at();

revoke execute on function public.handle_cars_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_routes_updated_at() from public, anon, authenticated;
