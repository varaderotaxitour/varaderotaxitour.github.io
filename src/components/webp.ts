export async function toWebp(file: File, maxW = 1600, quality = 0.82): Promise<File> {
  if (file.type === 'image/webp' || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxW / bitmap.width);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );
    if (!blob) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, {
      type: 'image/webp',
    });
  } catch {
    return file;
  }
}

export async function toWebpAll(files: File[], maxW?: number): Promise<File[]> {
  return Promise.all(files.map((file) => toWebp(file, maxW)));
}
