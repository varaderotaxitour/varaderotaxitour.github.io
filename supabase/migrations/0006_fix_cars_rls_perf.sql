drop policy if exists "cars_select_public" on public.cars;
create policy "cars_select_public" on public.cars
  for select to anon using (is_active = true);

grant select on public.cars to anon, authenticated;
