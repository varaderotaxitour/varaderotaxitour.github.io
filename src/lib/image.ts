// Central image helper - Supabase Storage Transform
export const MAX_PHOTOS_PER_ENTITY = 6;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB pre-webp
export const DEFAULT_QUALITY = 75;

export function supabaseImageUrl(
  supabaseUrl: string | undefined,
  path: string,
  opts: { width: number; quality?: number; format?: 'webp' | 'avif' } = { width: 800 }
): string {
  const { width, quality = DEFAULT_QUALITY, format = 'webp' } = opts;
  if (!supabaseUrl) return `/${path}`;
  const base = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/render/image/public/fotos/`;
  return `${base}${path}?width=${width}&quality=${quality}&format=${format}`;
}

export function isWebpPath(path: string): boolean {
  return path.toLowerCase().endsWith('.webp');
}

export function folderFor(path: string): string {
  return path.split('/')[0] ?? '';
}

// Validación antes de subir
export function validateFiles(files: File[], existingCount = 0): string | null {
  if (files.length + existingCount > MAX_PHOTOS_PER_ENTITY) {
    return `Máximo ${MAX_PHOTOS_PER_ENTITY} fotos por elemento. Ya tienes ${existingCount}, intentas añadir ${files.length}.`;
  }
  for (const f of files) {
    if (f.size > MAX_FILE_SIZE) {
      return `${f.name}: supera 5MB (${(f.size / 1024 / 1024).toFixed(1)}MB). Comprime o recorta la foto.`;
    }
    if (!f.type.startsWith('image/')) {
      return `${f.name}: no es una imagen válida.`;
    }
  }
  return null;
}
