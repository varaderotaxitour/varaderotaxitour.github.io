-- 0010_image_limits: limita espacio
-- Bucket fotos: 5MB por archivo, solo imagenes

update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif']
where id = 'fotos';
