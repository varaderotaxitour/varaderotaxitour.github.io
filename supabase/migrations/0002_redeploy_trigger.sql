-- Auto-publicación: cuando cambia public.settings, llama a la Edge Function
-- 'redeploy' (Supabase), que dispara el workflow de GitHub Pages vía
-- repository_dispatch.
--
-- IMPORTANTE: el repo es público. Sustituye <FUNCTION_URL> y <SHARED_SECRET>
-- por los valores reales (aplicados fuera de git) y revoca execute.

create extension if not exists pg_net with schema extensions;

grant execute on function net.http_post(text, jsonb, jsonb, jsonb, integer)
  to authenticated, service_role;

create or replace function public.notify_redeploy()
returns trigger
language plpgsql
as $$
declare
  req_id bigint;
begin
  select net.http_post(
    url := '<FUNCTION_URL>', -- ej: https://<ref>.supabase.co/functions/v1/redeploy
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-redeploy-secret', '<SHARED_SECRET>'
    ),
    body := jsonb_build_object('event_type', 'content_updated', 'source', 'settings')
  ) into req_id;
  return new;
end;
$$;

revoke execute on function public.notify_redeploy() from public, anon, authenticated;

drop trigger if exists settings_updated on public.settings;
create trigger settings_updated
after update on public.settings
for each row
when (old is distinct from new)
execute function public.notify_redeploy();