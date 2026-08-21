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

create or replace function public.notify_redeploy()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  req_id bigint;
  src text;
begin
  src := TG_TABLE_NAME;
  select net.http_post(
    url := '<FUNCTION_URL>',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-redeploy-secret', '<SHARED_SECRET>'
    ),
    body := jsonb_build_object('event_type', 'content_updated', 'source', src)
  ) into req_id;
  if TG_OP = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke execute on function public.notify_redeploy() from public, anon, authenticated;
revoke execute on function public.handle_cars_updated_at() from public, anon, authenticated;
