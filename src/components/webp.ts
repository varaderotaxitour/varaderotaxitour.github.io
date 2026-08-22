export async function toWebp(file: File, maxW = 1600, quality = 0.82): Promise<File> {
  if (file.type === 'image/webp' || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxW / bitmap.width);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas no disponible en este navegador');
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );
    if (!blob) throw new Error('No se pudo generar el WebP de la imagen');
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, {
      type: 'image/webp',
    });
  } catch (err) {
    throw err instanceof Error
      ? new Error(`${file.name}: ${err.message}`)
      : new Error(`${file.name}: error al convertir a WebP`);
  } finally {
    bitmap.close();
  }
}

export async function toWebpAll(files: File[], maxW?: number): Promise<File[]> {
  return Promise.all(files.map((file) => toWebp(file, maxW)));
}
