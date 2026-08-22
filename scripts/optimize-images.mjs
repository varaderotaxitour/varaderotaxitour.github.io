#!/usr/bin/env node
// Optimiza fotos existentes en bucket `fotos` a WebP 1400px q75
// Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/optimize-images.mjs
// Requiere: pnpm add -D sharp (ya está), @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const url = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Faltan PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(url, key);

async function listAll(prefix = '') {
  const { data, error } = await supabase.storage.from('fotos').list(prefix, { limit: 1000 });
  if (error) throw error;
  const files = [];
  for (const obj of data ?? []) {
    if (!obj.name) continue;
    // supabase list no dice si es carpeta; si no tiene extensión, asumimos carpeta
    if (!obj.name.includes('.')) {
      const sub = await listAll(prefix ? `${prefix}/${obj.name}` : obj.name);
      files.push(...sub);
    } else {
      files.push(prefix ? `${prefix}/${obj.name}` : obj.name);
    }
  }
  return files;
}

async function optimizeOne(path) {
  const needsWebp = !path.toLowerCase().endsWith('.webp');
  // Descargar
  const { data, error } = await supabase.storage.from('fotos').download(path);
  if (error) {
    console.warn(`skip ${path}: download error ${error.message}`);
    return { path, skipped: true, reason: error.message };
  }
  const buf = Buffer.from(await data.arrayBuffer());
  const meta = await sharp(buf).metadata();
  const shouldResize = (meta.width ?? 0) > 1400 || (meta.height ?? 0) > 1400;
  if (!needsWebp && !shouldResize) {
    return { path, skipped: true, reason: 'ya webp <=1400' };
  }
  const out = await sharp(buf)
    .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();
  const newPath = needsWebp ? path.replace(/\.[^.]+$/, '.webp') : path;
  // Subir nuevo
  const { error: upErr } = await supabase.storage.from('fotos').upload(newPath, out, {
    contentType: 'image/webp',
    cacheControl: '3600',
    upsert: true,
  });
  if (upErr) {
    console.error(`upload ${newPath} fail: ${upErr.message}`);
    return { path, error: upErr.message };
  }
  // Actualizar referencias en DB si cambió extensión
  if (newPath !== path) {
    // routes
    const { data: routes } = await supabase.from('routes').select('id, photos').contains('photos', [path]);
    for (const r of routes ?? []) {
      const next = r.photos.map((p) => (p === path ? newPath : p));
      await supabase.from('routes').update({ photos: next }).eq('id', r.id);
    }
    const { data: cars } = await supabase.from('cars').select('id, photos').contains('photos', [path]);
    for (const c of cars ?? []) {
      const next = c.photos.map((p) => (p === path ? newPath : p));
      await supabase.from('cars').update({ photos: next }).eq('id', c.id);
    }
    const { data: settings } = await supabase.from('settings').select('id, hero_image_url, about_image_url').or(`hero_image_url.eq.${path},about_image_url.eq.${path}`);
    for (const s of settings ?? []) {
      const upd = {};
      if (s.hero_image_url === path) upd.hero_image_url = newPath;
      if (s.about_image_url === path) upd.about_image_url = newPath;
      if (Object.keys(upd).length) await supabase.from('settings').update(upd).eq('id', s.id);
    }
    // Borrar original
    await supabase.storage.from('fotos').remove([path]);
    console.log(`→ ${path} (${(buf.length/1024).toFixed(0)}KB) → ${newPath} (${(out.length/1024).toFixed(0)}KB) ahorro ${(((buf.length-out.length)/buf.length)*100).toFixed(0)}%`);
    return { path, newPath, saved: buf.length - out.length };
  } else {
    // mismo path pero re-encodeado más ligero: ya se hizo upsert
    console.log(`↻ ${path} re-encoded ${(buf.length/1024).toFixed(0)}KB → ${(out.length/1024).toFixed(0)}KB`);
    return { path, resized: true, saved: buf.length - out.length };
  }
}

const all = await listAll('');
console.log(`Encontradas ${all.length} fotos en bucket fotos`);
let totalSaved = 0;
let done = 0;
for (const p of all) {
  try {
    const r = await optimizeOne(p);
    if (r.saved) totalSaved += r.saved;
    done++;
  } catch (e) {
    console.error(`error ${p}:`, e.message);
  }
}
console.log(`Hecho ${done}/${all.length}, ahorro total ${(totalSaved/1024).toFixed(0)}KB`);
