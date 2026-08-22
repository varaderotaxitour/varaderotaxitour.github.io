export async function toWebp(file: File, maxW = 1400, quality = 0.75): Promise<File> {
  // gif/svg no se tocan; webp se redimensiona si excede maxW
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }
  const isAlreadyWebp = file.type === 'image/webp';
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // HEIC u otros no decodificables: si no es webp, lanzar para que el caller avise
    throw new Error(`${file.name}: formato no soportado por el navegador. Convierte a JPG/PNG antes de subir.`);
  }
  try {
    const needsResize = bitmap.width > maxW || bitmap.height > maxW || !isAlreadyWebp;
    // Si es webp y ya está dentro de maxW, no re-encodear para no perder calidad
    if (isAlreadyWebp && !needsResize) {
      return file;
    }
    const scale = Math.min(1, maxW / Math.max(bitmap.width, bitmap.height));
    // si es webp grande, solo redimensionar; si no es webp, convertir siempre
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    if (!needsResize) {
      return file;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas no disponible');
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );
    if (!blob) throw new Error('No se pudo generar WebP');
    // Si el webp resultante es más pesado que el original (raro), quedarse con el menor
    if (isAlreadyWebp && blob.size >= file.size && width === bitmap.width) {
      return file;
    }
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, {
      type: 'image/webp',
    });
  } finally {
    bitmap?.close();
  }
}

export async function toWebpAll(files: File[], maxW = 1400, quality = 0.75): Promise<File[]> {
  const results = await Promise.allSettled(files.map((f) => toWebp(f, maxW, quality)));
  const ok: File[] = [];
  const errs: string[] = [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === 'fulfilled') ok.push(r.value);
    else errs.push((r.reason as Error).message);
  }
  if (errs.length) {
    throw new Error(errs.join(' | '));
  }
  return ok;
}
