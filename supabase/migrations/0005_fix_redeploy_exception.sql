create or replace function public.notify_redeploy()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  req_id bigint;
  src text;
  target_url text := '<FUNCTION_URL>';
begin
  if target_url = '<FUNCTION_URL>' or target_url = '' or target_url not like 'https://%' then
    if TG_OP = 'DELETE' then return old; end if;
    return new;
  end if;

  src := TG_TABLE_NAME;
  begin
    select net.http_post(
      url := target_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-redeploy-secret', '<SHARED_SECRET>'
      ),
      body := jsonb_build_object('event_type', 'content_updated', 'source', src)
    ) into req_id;
  exception when others then
    raise warning 'notify_redeploy failed: %', SQLERRM;
  end;

  if TG_OP = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke execute on function public.notify_redeploy() from public, anon, authenticated;
