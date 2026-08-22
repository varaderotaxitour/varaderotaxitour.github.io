-- ============================================================
-- Storage: restringe escritura autenticada a las carpetas del panel
-- (cars/, rutas/, galeria/). Lectura pública se mantiene intacta.
-- Aplicada remotamente como "storage_folder_policies".
-- ============================================================

drop policy if exists "fotos_upload_auth" on storage.objects;
create policy "fotos_upload_auth"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'fotos'
    and (name like 'cars/%' or name like 'rutas/%' or name like 'galeria/%')
  );

drop policy if exists "fotos_update_auth" on storage.objects;
create policy "fotos_update_auth"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'fotos'
    and (name like 'cars/%' or name like 'rutas/%' or name like 'galeria/%')
  )
  with check (
    bucket_id = 'fotos'
    and (name like 'cars/%' or name like 'rutas/%' or name like 'galeria/%')
  );

drop policy if exists "fotos_delete_auth" on storage.objects;
create policy "fotos_delete_auth"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'fotos'
    and (name like 'cars/%' or name like 'rutas/%' or name like 'galeria/%')
  );
