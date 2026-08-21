import { useEffect, useState } from 'react';
import { createClient, type Session } from '@supabase/supabase-js';
import { toWebp, toWebpAll } from './webp';
import './admin.css';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const ICONS = [
  'plane', 'wave', 'landmark', 'flag', 'palm', 'dolphin', 'pin', 'glass',
  'whatsapp', 'instagram', 'phone', 'check', 'clock', 'car',
];

type TrustItem = { icon: string; title: string; text: string };
type Route = {
  icon: string;
  title: string;
  description: string;
  priceFrom: number;
  priceTo: number;
};

type Settings = {
  seo_title: string;
  seo_description: string;
  whatsapp_number: string;
  whatsapp_message: string;
  phone_display: string;
  instagram_url: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_lead: string;
  hero_note: string;
  hero_image_url: string | null;
  about_quote: string;
  about_text: string;
  about_image_url: string | null;
  trust_items: TrustItem[];
  routes: Route[];
  cta_eyebrow: string;
  cta_title: string;
  cta_lead: string;
  footer_tagline: string;
  footer_copyright: string;
};

type CommentRow = {
  id: number;
  name: string;
  message: string;
  approved: boolean;
  created_at: string;
};

type UploadRow = { name: string; id: string };

type CarRow = {
  id: number;
  name: string;
  description: string;
  details: string | null;
  photos: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type RouteRow = {
  id: number;
  title: string;
  description: string;
  icon: string;
  price_from: number;
  price_to: number;
  photos: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type PendingPhoto = { file: File; url: string };

const emptySettings: Settings = {
  seo_title: '', seo_description: '', whatsapp_number: '', whatsapp_message: '',
  phone_display: '', instagram_url: '', hero_eyebrow: '', hero_title: '',
  hero_lead: '', hero_note: '', hero_image_url: null, about_quote: '',
  about_text: '', about_image_url: null, trust_items: [], routes: [],
  cta_eyebrow: '', cta_title: '', cta_lead: '', footer_tagline: '', footer_copyright: '',
};

const input = (value: string | null | undefined) => value ?? '';

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [tab, setTab] = useState<'contenido' | 'rutas' | 'carros' | 'comentarios' | 'fotos'>('contenido');

  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'publishing' | 'published' | 'failed'>('idle');

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [notice, setNotice] = useState('');

  // ---- Carros ----
  const [cars, setCars] = useState<CarRow[]>([]);
  const [carsLoaded, setCarsLoaded] = useState(false);
  const [carForm, setCarForm] = useState({ name: '', description: '', details: '', sort_order: 0, is_active: true });
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [carSaving, setCarSaving] = useState(false);
  const [carPhotoBusyId, setCarPhotoBusyId] = useState<number | null>(null);
  const [pendingCarFiles, setPendingCarFiles] = useState<PendingPhoto[]>([]);

  // ---- Rutas ----
  const [routes, setRoutes] = useState<RouteRow[]>([]);
  const [routesLoaded, setRoutesLoaded] = useState(false);
  const [routeForm, setRouteForm] = useState({
    title: '', description: '', icon: 'pin',
    price_from: 0, price_to: 0, sort_order: 0, is_active: true,
  });
  const [editingRouteId, setEditingRouteId] = useState<number | null>(null);
  const [routeSaving, setRouteSaving] = useState(false);
  const [routePhotoBusyId, setRoutePhotoBusyId] = useState<number | null>(null);
  const [pendingRouteFiles, setPendingRouteFiles] = useState<PendingPhoto[]>([]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    if (session && !settingsLoaded) {
      supabase
        .from('settings')
        .select('*')
        .single()
        .then(({ data }) => {
          if (data) setSettings({ ...emptySettings, ...(data as Settings) });
          setSettingsLoaded(true);
        });
      loadComments();
      loadUploads();
      loadCars();
      loadRoutes();
    }
  }, [session, settingsLoaded]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setAuthError('');
    if (!supabase) {
      setAuthError('Configuración de Supabase no disponible.');
      return;
    }
    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthBusy(false);
    if (error) setAuthError('Credenciales incorrectas. Revisa email y contraseña.');
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSettingsLoaded(false);
    setCarsLoaded(false);
  }

  function setField<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function saveSettings() {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase
      .from('settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', 1);
    setSaving(false);
    if (error) {
      flash('Error al guardar: ' + error.message);
    } else {
      setDeployStatus('publishing');
      trackDeploy(Date.now());
    }
  }

  function trackDeploy(_since: number) {
    setDeployStatus('publishing');
    window.setTimeout(() => {
      setDeployStatus('published');
    }, 40000);
  }

  // ---- Comments ----
  async function loadComments() {
    if (!supabase) return;
    const { data } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setComments(data as CommentRow[]);
  }

  async function setApproved(comment: CommentRow, approved: boolean) {
    if (!supabase) return;
    await supabase.from('comments').update({ approved }).eq('id', comment.id);
    loadComments();
  }

  async function deleteComment(comment: CommentRow) {
    if (!supabase) return;
    if (!window.confirm('¿Eliminar este comentario?')) return;
    await supabase.from('comments').delete().eq('id', comment.id);
    loadComments();
  }

  // ---- Fotos generales ----
  async function loadUploads() {
    if (!supabase) return;
    const { data } = await supabase.storage.from('fotos').list('galeria', {
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (data) setUploads(data as unknown as UploadRow[]);
  }

  function makePending(files: File[]): PendingPhoto[] {
    return files.map((file) => ({ file, url: URL.createObjectURL(file) }));
  }

  function clearPending(entries: PendingPhoto[]) {
    entries.forEach((entry) => URL.revokeObjectURL(entry.url));
  }

  async function uploadPhotos(folder: string, entries: PendingPhoto[]): Promise<string[]> {
    if (!supabase) return [];
    const paths: string[] = [];
    for (const entry of entries) {
      const converted = await toWebp(entry.file);
      const safeName = converted.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeName}`;
      const { error } = await supabase.storage.from('fotos').upload(path, converted, {
        upsert: false,
      });
      if (error) throw new Error(error.message);
      paths.push(path);
    }
    return paths;
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!supabase) return;
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    setUploadBusy(true);
    try {
      const converted = await toWebpAll(files);
      let ok = 0;
      for (const file of converted) {
        const path = `galeria/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error } = await supabase.storage.from('fotos').upload(path, file, {
          upsert: false,
        });
        if (error) flash(`Error al subir ${file.name}: ${error.message}`);
        else ok += 1;
      }
      if (ok > 0) {
        loadUploads();
        flash(`${ok} foto${ok > 1 ? 's' : ''} subida${ok > 1 ? 's' : ''} ✓ Ahora asígnala con los botones de abajo.`);
      }
    } finally {
      setUploadBusy(false);
    }
  }

  async function assignPhoto(path: string, field: 'hero_image_url' | 'about_image_url') {
    if (!supabase) return;
    await supabase
      .from('settings')
      .update({ [field]: path, updated_at: new Date().toISOString() })
      .eq('id', 1);
    setField(field, path);
    flash('Foto asignada ✓ El sitio se publicará automáticamente.');
  }

  async function deleteUpload(upload: UploadRow) {
    if (!supabase) return;
    if (!window.confirm('¿Eliminar esta foto del almacenamiento?')) return;
    const { error } = await supabase.storage.from('fotos').remove([`galeria/${upload.name}`]);
    if (!error) loadUploads();
    else flash('Error al eliminar: ' + error.message);
  }

  // ---- Carros: CRUD ----
  async function loadCars() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (!error && data) {
      setCars(data as CarRow[]);
      setCarsLoaded(true);
    } else if (error) {
      // tabla puede no existir aún en local sin migraciones
      console.warn('[cars] load error', error.message);
    }
  }

  function resetCarForm() {
    setCarForm({ name: '', description: '', details: '', sort_order: 0, is_active: true });
    setEditingCarId(null);
    clearPending(pendingCarFiles);
    setPendingCarFiles([]);
  }

  function startEditCar(car: CarRow) {
    setCarForm({
      name: car.name,
      description: car.description,
      details: car.details ?? '',
      sort_order: car.sort_order,
      is_active: car.is_active,
    });
    setEditingCarId(car.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSaveCar() {
    if (!supabase) return;
    if (!carForm.name.trim() || carForm.name.trim().length < 2) {
      flash('El nombre del carro debe tener al menos 2 caracteres.');
      return;
    }
    if (!carForm.description.trim() || carForm.description.trim().length < 2) {
      flash('La descripción debe tener al menos 2 caracteres.');
      return;
    }
    setCarSaving(true);
    try {
      const payload = {
        name: carForm.name.trim(),
        description: carForm.description.trim(),
        details: carForm.details.trim() || null,
        sort_order: Number(carForm.sort_order) || 0,
        is_active: carForm.is_active,
      };
      let carId: number;
      if (editingCarId) {
        const { error } = await supabase.from('cars').update(payload).eq('id', editingCarId);
        if (error) throw new Error(error.message);
        carId = editingCarId;
      } else {
        const { data, error } = await supabase.from('cars').insert(payload).select('id').single();
        if (error) throw new Error(error.message);
        carId = data.id;
      }
      if (pendingCarFiles.length > 0) {
        const existing = editingCarId ? cars.find((c) => c.id === carId)?.photos ?? [] : [];
        const paths = await uploadPhotos(`cars/${carId}`, pendingCarFiles);
        const { error: photoErr } = await supabase
          .from('cars')
          .update({ photos: [...existing, ...paths] })
          .eq('id', carId);
        if (photoErr) flash(`Carro guardado pero error al asignar fotos: ${photoErr.message}`);
      }
      clearPending(pendingCarFiles);
      setPendingCarFiles([]);
      flash(editingCarId ? 'Carro actualizado ✓' : 'Carro creado ✓');
      resetCarForm();
      loadCars();
      setDeployStatus('publishing');
      trackDeploy(Date.now());
    } catch (err) {
      flash('Error al guardar carro: ' + (err as Error).message);
    } finally {
      setCarSaving(false);
    }
  }

  async function toggleCarActive(car: CarRow) {
    if (!supabase) return;
    const { error } = await supabase.from('cars').update({ is_active: !car.is_active }).eq('id', car.id);
    if (error) flash('Error: ' + error.message);
    else {
      flash(car.is_active ? 'Carro desactivado ✓' : 'Carro activado ✓');
      loadCars();
      setDeployStatus('publishing');
      trackDeploy(Date.now());
    }
  }

  async function deleteCar(car: CarRow) {
    if (!supabase) return;
    if (!window.confirm(`¿Eliminar el carro "${car.name}"? Esta acción no se puede deshacer.`)) return;
    // Borrar fotos asociadas en storage (best-effort)
    if (car.photos && car.photos.length > 0) {
      await supabase.storage.from('fotos').remove(car.photos);
    }
    const { error } = await supabase.from('cars').delete().eq('id', car.id);
    if (error) flash('Error al eliminar: ' + error.message);
    else {
      flash('Carro eliminado ✓');
      loadCars();
      setDeployStatus('publishing');
      trackDeploy(Date.now());
    }
  }

  async function handleCarPhotoUpload(car: CarRow, event: React.ChangeEvent<HTMLInputElement>) {
    if (!supabase) return;
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    setCarPhotoBusyId(car.id);
    try {
      const pending = makePending(files);
      const paths = await uploadPhotos(`cars/${car.id}`, pending);
      clearPending(pending);
      const newPhotos = [...(car.photos || []), ...paths];
      const { error: dbErr } = await supabase.from('cars').update({ photos: newPhotos }).eq('id', car.id);
      if (dbErr) throw new Error(dbErr.message);
      flash(`${paths.length} foto${paths.length > 1 ? 's' : ''} añadida${paths.length > 1 ? 's' : ''} ✓`);
      loadCars();
      setDeployStatus('publishing');
      trackDeploy(Date.now());
    } catch (err) {
      flash('Error al subir fotos: ' + (err as Error).message);
    } finally {
      setCarPhotoBusyId(null);
    }
  }

  async function removeCarPhoto(car: CarRow, photoPath: string) {
    if (!supabase) return;
    if (!window.confirm('¿Quitar esta foto del carro?')) return;
    const newPhotos = (car.photos || []).filter((p) => p !== photoPath);
    const { error: dbErr } = await supabase.from('cars').update({ photos: newPhotos }).eq('id', car.id);
    if (dbErr) {
      flash('Error al quitar foto: ' + dbErr.message);
      return;
    }
    const { error: stErr } = await supabase.storage.from('fotos').remove([photoPath]);
    if (stErr) console.warn('storage remove', stErr.message);
    flash('Foto quitada ✓');
    loadCars();
  }

  // ---- Rutas: CRUD ----
  async function loadRoutes() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (!error && data) {
      setRoutes(data as RouteRow[]);
      setRoutesLoaded(true);
    } else if (error) {
      console.warn('[routes] load error', error.message);
    }
  }

  function resetRouteForm() {
    setRouteForm({
      title: '', description: '', icon: 'pin',
      price_from: 0, price_to: 0, sort_order: 0, is_active: true,
    });
    setEditingRouteId(null);
    clearPending(pendingRouteFiles);
    setPendingRouteFiles([]);
  }

  function startEditRoute(route: RouteRow) {
    setRouteForm({
      title: route.title,
      description: route.description,
      icon: route.icon,
      price_from: route.price_from,
      price_to: route.price_to,
      sort_order: route.sort_order,
      is_active: route.is_active,
    });
    setEditingRouteId(route.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function addPendingRouteFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    setPendingRouteFiles((prev) => [...prev, ...makePending(files)]);
  }

  function removePendingRouteFile(index: number) {
    setPendingRouteFiles((prev) => {
      clearPending([prev[index]]);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSaveRoute() {
    if (!supabase) return;
    const title = routeForm.title.trim();
    const description = routeForm.description.trim();
    if (title.length < 2 || title.length > 80) {
      flash('El título debe tener entre 2 y 80 caracteres.');
      return;
    }
    if (description.length < 2 || description.length > 1000) {
      flash('La descripción debe tener entre 2 y 1000 caracteres.');
      return;
    }
    setRouteSaving(true);
    try {
      const payload = {
        title,
        description,
        icon: routeForm.icon,
        price_from: Number(routeForm.price_from) || 0,
        price_to: Number(routeForm.price_to) || 0,
        sort_order: Number(routeForm.sort_order) || 0,
        is_active: routeForm.is_active,
      };
      let routeId: number;
      if (editingRouteId) {
        const { error } = await supabase.from('routes').update(payload).eq('id', editingRouteId);
        if (error) throw new Error(error.message);
        routeId = editingRouteId;
      } else {
        const { data, error } = await supabase.from('routes').insert(payload).select('id').single();
        if (error) throw new Error(error.message);
        routeId = data.id;
      }
      if (pendingRouteFiles.length > 0) {
        const existing = editingRouteId ? routes.find((r) => r.id === routeId)?.photos ?? [] : [];
        const paths = await uploadPhotos(`rutas/${routeId}`, pendingRouteFiles);
        const { error: photoErr } = await supabase
          .from('routes')
          .update({ photos: [...existing, ...paths] })
          .eq('id', routeId);
        if (photoErr) flash(`Ruta guardada pero error al asignar fotos: ${photoErr.message}`);
      }
      clearPending(pendingRouteFiles);
      setPendingRouteFiles([]);
      flash(editingRouteId ? 'Ruta actualizada ✓' : 'Ruta creada ✓');
      resetRouteForm();
      loadRoutes();
      setDeployStatus('publishing');
      trackDeploy(Date.now());
    } catch (err) {
      flash('Error al guardar ruta: ' + (err as Error).message);
    } finally {
      setRouteSaving(false);
    }
  }

  async function toggleRouteActive(route: RouteRow) {
    if (!supabase) return;
    const { error } = await supabase.from('routes').update({ is_active: !route.is_active }).eq('id', route.id);
    if (error) flash('Error: ' + error.message);
    else {
      flash(route.is_active ? 'Ruta desactivada ✓' : 'Ruta activada ✓');
      loadRoutes();
      setDeployStatus('publishing');
      trackDeploy(Date.now());
    }
  }

  async function deleteRoute(route: RouteRow) {
    if (!supabase) return;
    if (!window.confirm(`¿Eliminar la ruta "${route.title}"? Esta acción no se puede deshacer.`)) return;
    if (route.photos && route.photos.length > 0) {
      await supabase.storage.from('fotos').remove(route.photos);
    }
    const { error } = await supabase.from('routes').delete().eq('id', route.id);
    if (error) flash('Error al eliminar: ' + error.message);
    else {
      flash('Ruta eliminada ✓');
      loadRoutes();
      setDeployStatus('publishing');
      trackDeploy(Date.now());
    }
  }

  async function handleRoutePhotoUpload(route: RouteRow, event: React.ChangeEvent<HTMLInputElement>) {
    if (!supabase) return;
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    setRoutePhotoBusyId(route.id);
    try {
      const pending = makePending(files);
      const paths = await uploadPhotos(`rutas/${route.id}`, pending);
      clearPending(pending);
      const newPhotos = [...(route.photos || []), ...paths];
      const { error: dbErr } = await supabase.from('routes').update({ photos: newPhotos }).eq('id', route.id);
      if (dbErr) throw new Error(dbErr.message);
      flash(`${paths.length} foto${paths.length > 1 ? 's' : ''} añadida${paths.length > 1 ? 's' : ''} ✓`);
      loadRoutes();
      setDeployStatus('publishing');
      trackDeploy(Date.now());
    } catch (err) {
      flash('Error al subir fotos: ' + (err as Error).message);
    } finally {
      setRoutePhotoBusyId(null);
    }
  }

  async function removeRoutePhoto(route: RouteRow, photoPath: string) {
    if (!supabase) return;
    if (!window.confirm('¿Quitar esta foto de la ruta?')) return;
    const newPhotos = (route.photos || []).filter((p) => p !== photoPath);
    const { error: dbErr } = await supabase.from('routes').update({ photos: newPhotos }).eq('id', route.id);
    if (dbErr) {
      flash('Error al quitar foto: ' + dbErr.message);
      return;
    }
    const { error: stErr } = await supabase.storage.from('fotos').remove([photoPath]);
    if (stErr) console.warn('storage remove', stErr.message);
    flash('Foto quitada ✓');
    loadRoutes();
  }

  const photoUrl = (path: string | null, width: number) =>
    path ? `${supabaseUrl}/storage/v1/object/public/fotos/${path}?width=${width}` : '';

  if (!session) {
    return (
      <div className="admin-login">
        <img src="/logo.webp" alt="Varadero Taxi Tour" className="admin-logo" />
        <h1>Panel de administración</h1>
        <form onSubmit={handleLogin} className="admin-login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {authError && <p className="admin-error">{authError}</p>}
          <button className="btn btn-primary" type="submit" disabled={authBusy}>
            {authBusy ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div className="admin-header-inner">
          <img src="/logo.webp" alt="Varadero Taxi Tour" />
          <span>Administración</span>
          <nav className="admin-tabs">
            <button className={tab === 'contenido' ? 'active' : ''} onClick={() => setTab('contenido')}>
              Contenido
            </button>
            <button className={tab === 'rutas' ? 'active' : ''} onClick={() => setTab('rutas')}>
              Rutas
            </button>
            <button className={tab === 'carros' ? 'active' : ''} onClick={() => setTab('carros')}>
              Carros
            </button>
            <button className={tab === 'comentarios' ? 'active' : ''} onClick={() => setTab('comentarios')}>
              Comentarios
            </button>
            <button className={tab === 'fotos' ? 'active' : ''} onClick={() => setTab('fotos')}>
              Fotos
            </button>
          </nav>
          <button className="admin-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <main className="admin-main">
        {notice && <p className="admin-notice">{notice}</p>}

        {deployStatus === 'publishing' && (
          <p className="admin-notice">Guardado ✓ — publicando el sitio (~2 minutos)…</p>
        )}
        {deployStatus === 'published' && (
          <p className="admin-notice admin-notice-ok">Sitio publicado ✓ Ya puedes ver los cambios.</p>
        )}
        {deployStatus === 'failed' && (
          <p className="admin-notice admin-notice-error">
            No se pudo publicar automáticamente. Revisa las Actions de GitHub.
          </p>
        )}

        {tab === 'contenido' && (
          <section className="admin-panel">
            <h2>Contenido del sitio</h2>
            <p className="admin-hint">
              Al guardar, el sitio se publica automáticamente en unos 2 minutos.
              Los comentarios se moderan al instante.
            </p>

            <fieldset>
              <legend>SEO</legend>
              <label> Título SEO
                <input value={input(settings.seo_title)} onChange={(e) => setField('seo_title', e.target.value)} />
              </label>
              <label> Descripción SEO
                <textarea rows={2} value={input(settings.seo_description)} onChange={(e) => setField('seo_description', e.target.value)} />
              </label>
            </fieldset>

            <fieldset>
              <legend>Contacto</legend>
              <label> WhatsApp (solo dígitos, con código de país)
                <input value={input(settings.whatsapp_number)} onChange={(e) => setField('whatsapp_number', e.target.value)} />
              </label>
              <label> Mensaje precargado de WhatsApp
                <input value={input(settings.whatsapp_message)} onChange={(e) => setField('whatsapp_message', e.target.value)} />
              </label>
              <label> Teléfono mostrado en pantalla
                <input value={input(settings.phone_display)} onChange={(e) => setField('phone_display', e.target.value)} />
              </label>
              <label> URL de Instagram
                <input value={input(settings.instagram_url)} onChange={(e) => setField('instagram_url', e.target.value)} />
              </label>
            </fieldset>

            <fieldset>
              <legend>Hero</legend>
              <label> Eyebrow
                <input value={input(settings.hero_eyebrow)} onChange={(e) => setField('hero_eyebrow', e.target.value)} />
              </label>
              <label> Título principal
                <input value={input(settings.hero_title)} onChange={(e) => setField('hero_title', e.target.value)} />
              </label>
              <label> Texto de introducción
                <textarea rows={3} value={input(settings.hero_lead)} onChange={(e) => setField('hero_lead', e.target.value)} />
              </label>
              <label> Nota bajo los botones
                <input value={input(settings.hero_note)} onChange={(e) => setField('hero_note', e.target.value)} />
              </label>
              {settings.hero_image_url && (
                <img className="admin-preview" src={photoUrl(settings.hero_image_url, 400)} alt="Foto del hero" />
              )}
            </fieldset>

            <fieldset>
              <legend>Nosotros</legend>
              <label> Cita
                <input value={input(settings.about_quote)} onChange={(e) => setField('about_quote', e.target.value)} />
              </label>
              <label> Texto
                <textarea rows={3} value={input(settings.about_text)} onChange={(e) => setField('about_text', e.target.value)} />
              </label>
              {settings.about_image_url && (
                <img className="admin-preview" src={photoUrl(settings.about_image_url, 400)} alt="Foto de nosotros" />
              )}
            </fieldset>

            <fieldset>
              <legend>Puntos de confianza</legend>
              {settings.trust_items.map((item, index) => (
                <div className="admin-item" key={index}>
                  <select
                    value={item.icon}
                    onChange={(e) =>
                      setField('trust_items', settings.trust_items.map((it, i) => i === index ? { ...it, icon: e.target.value } : it))
                    }
                  >
                    {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                  <input
                    placeholder="Título"
                    value={item.title}
                    onChange={(e) =>
                      setField('trust_items', settings.trust_items.map((it, i) => i === index ? { ...it, title: e.target.value } : it))
                    }
                  />
                  <input
                    placeholder="Texto"
                    value={item.text}
                    onChange={(e) =>
                      setField('trust_items', settings.trust_items.map((it, i) => i === index ? { ...it, text: e.target.value } : it))
                    }
                  />
                  <button type="button" className="admin-remove" onClick={() =>
                    setField('trust_items', settings.trust_items.filter((_, i) => i !== index))
                  }>
                    Quitar
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-ghost-small"
                onClick={() => setField('trust_items', [...settings.trust_items, { icon: 'check', title: '', text: '' }])}
              >
                + Añadir punto de confianza
              </button>
            </fieldset>

            <fieldset>
              <legend>Rutas y servicios</legend>
              <p className="admin-hint" style={{ margin: 0 }}>
                Las rutas se gestionan ahora en la pestaña <strong>Rutas</strong>, donde puedes
                crearlas con fotos, precios y orden. Lo que editabas aquí ya no se muestra en la web.
              </p>
            </fieldset>

            <fieldset>
              <legend>CTA final</legend>
              <label> Eyebrow
                <input value={input(settings.cta_eyebrow)} onChange={(e) => setField('cta_eyebrow', e.target.value)} />
              </label>
              <label> Título
                <input value={input(settings.cta_title)} onChange={(e) => setField('cta_title', e.target.value)} />
              </label>
              <label> Texto de introducción
                <textarea rows={2} value={input(settings.cta_lead)} onChange={(e) => setField('cta_lead', e.target.value)} />
              </label>
            </fieldset>

            <fieldset>
              <legend>Footer</legend>
              <label> Frase
                <input value={input(settings.footer_tagline)} onChange={(e) => setField('footer_tagline', e.target.value)} />
              </label>
              <label> Copyright (sin año)
                <input value={input(settings.footer_copyright)} onChange={(e) => setField('footer_copyright', e.target.value)} />
              </label>
            </fieldset>

            <button className="btn btn-primary" onClick={saveSettings} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar contenido'}
            </button>
          </section>
        )}

        {tab === 'rutas' && (
          <section className="admin-panel">
            <h2>Rutas y servicios</h2>
            <p className="admin-hint">
              Crea rutas con sus fotos directamente (se convierten a WebP automáticamente, sin límite
              de cantidad). Los cambios se publican automáticamente (~2 min). Solo las rutas <em>activas</em> se muestran en la web.
            </p>

            <fieldset className="admin-car-form">
              <legend>{editingRouteId ? 'Editar ruta' : 'Nueva ruta'}</legend>
              <label> Título *
                <input
                  placeholder="Ej: Excursión a La Habana"
                  value={routeForm.title}
                  onChange={(e) => setRouteForm({ ...routeForm, title: e.target.value })}
                />
              </label>
              <label> Descripción *
                <textarea
                  rows={3}
                  placeholder="Ej: Plaza de la Revolución, Malecón, Habana Vieja, Fábrica de Tabacos y Morro-Cabaña."
                  value={routeForm.description}
                  onChange={(e) => setRouteForm({ ...routeForm, description: e.target.value })}
                />
              </label>
              <div className="admin-car-form-row">
                <label> Icono
                  <select
                    value={routeForm.icon}
                    onChange={(e) => setRouteForm({ ...routeForm, icon: e.target.value })}
                  >
                    {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </label>
                <label> Orden
                  <input
                    type="number"
                    value={routeForm.sort_order}
                    onChange={(e) => setRouteForm({ ...routeForm, sort_order: Number(e.target.value) })}
                  />
                </label>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={routeForm.is_active}
                    onChange={(e) => setRouteForm({ ...routeForm, is_active: e.target.checked })}
                  />
                  Activa (visible en la web)
                </label>
              </div>
              <div className="admin-price-row">
                <label> Precio desde (USD/EUR)
                  <input
                    type="number"
                    min={0}
                    value={routeForm.price_from}
                    onChange={(e) => setRouteForm({ ...routeForm, price_from: Number(e.target.value) })}
                  />
                </label>
                <label> Precio hasta (USD/EUR)
                  <input
                    type="number"
                    min={0}
                    value={routeForm.price_to}
                    onChange={(e) => setRouteForm({ ...routeForm, price_to: Number(e.target.value) })}
                  />
                </label>
              </div>
              <div className="admin-pending">
                <label className="btn btn-ghost-small file-label">
                  + Añadir fotos
                  <input type="file" accept="image/*" multiple hidden onChange={addPendingRouteFiles} />
                </label>
                {pendingRouteFiles.length > 0 && (
                  <div className="admin-pending-previews">
                    {pendingRouteFiles.map((pending, index) => (
                      <div className="admin-pending-thumb" key={`${pending.url}-${index}`}>
                        <img src={pending.url} alt="" />
                        <button
                          type="button"
                          aria-label="Quitar foto pendiente"
                          onClick={() => removePendingRouteFile(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="admin-car-form-actions">
                <button className="btn btn-primary" onClick={handleSaveRoute} disabled={routeSaving}>
                  {routeSaving
                    ? 'Guardando…'
                    : editingRouteId
                      ? 'Actualizar ruta'
                      : pendingRouteFiles.length > 0
                        ? `Crear ruta con ${pendingRouteFiles.length} foto${pendingRouteFiles.length > 1 ? 's' : ''}`
                        : 'Crear ruta'}
                </button>
                {editingRouteId && (
                  <button type="button" className="btn btn-ghost-small" onClick={resetRouteForm}>
                    Cancelar edición
                  </button>
                )}
              </div>
            </fieldset>

            {!routesLoaded ? (
              <p className="admin-hint">Cargando rutas…</p>
            ) : routes.length === 0 ? (
              <p className="admin-hint">Aún no hay rutas. Crea la primera arriba.</p>
            ) : (
              <ul className="admin-cars">
                {routes.map((route) => (
                  <li key={route.id} className={`admin-car-card ${route.is_active ? 'active' : 'inactive'}`}>
                    <div className="admin-car-head">
                      <h3>{route.title}</h3>
                      <span className={route.is_active ? 'badge badge-ok' : 'badge badge-wait'}>
                        {route.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                      <span className="admin-car-order">Orden: {route.sort_order}</span>
                    </div>
                    <p className="admin-car-details">{route.price_from} – {route.price_to} USD/EUR</p>
                    <p className="admin-car-desc">{route.description}</p>

                    <div className="admin-car-photos">
                      {route.photos && route.photos.length > 0 ? (
                        route.photos.map((photo) => (
                          <div key={photo} className="admin-car-photo">
                            <img src={photoUrl(photo, 400)} alt={route.title} />
                            <button className="btn btn-danger-small" onClick={() => removeRoutePhoto(route, photo)}>
                              Quitar
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="admin-hint">Sin fotos</p>
                      )}
                    </div>

                    <div className="admin-car-actions">
                      <label className="btn btn-ghost-small file-label">
                        {routePhotoBusyId === route.id ? 'Subiendo…' : '+ Foto'}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          disabled={routePhotoBusyId === route.id}
                          onChange={(e) => handleRoutePhotoUpload(route, e)}
                        />
                      </label>
                      <span className="admin-hint" style={{ margin: 0 }}>
                        {route.photos?.length ?? 0} fotos
                      </span>
                      <button className="btn btn-ghost-small" onClick={() => startEditRoute(route)}>
                        Editar
                      </button>
                      <button className="btn btn-ghost-small" onClick={() => toggleRouteActive(route)}>
                        {route.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button className="btn btn-danger-small" onClick={() => deleteRoute(route)}>
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'carros' && (
          <section className="admin-panel">
            <h2>Carros disponibles</h2>
            <p className="admin-hint">
              Gestiona tu flota: crea, edita, activa/desactiva o elimina carros. Fotos ilimitadas,
              convertidas a WebP automáticamente. Los cambios se publican automáticamente (~2 min).
              Solo los carros <em>activos</em> se muestran en la web, debajo de Rutas &amp; precios.
            </p>

            <fieldset className="admin-car-form">
              <legend>{editingCarId ? 'Editar carro' : 'Nuevo carro'}</legend>
              <label> Nombre del carro *
                <input
                  placeholder="Ej: Chevrolet Impala 1958 Convertible"
                  value={carForm.name}
                  onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                />
              </label>
              <label> Descripción *
                <textarea
                  rows={3}
                  placeholder="Ej: Clásico americano impecable, capota descapotable, ideal para fotos y paseos por la costa."
                  value={carForm.description}
                  onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                />
              </label>
              <label> Detalles (opcional)
                <input
                  placeholder="Ej: 4 pax · Convertible · A/C · 1958"
                  value={carForm.details}
                  onChange={(e) => setCarForm({ ...carForm, details: e.target.value })}
                />
              </label>
              <div className="admin-car-form-row">
                <label> Orden
                  <input
                    type="number"
                    value={carForm.sort_order}
                    onChange={(e) => setCarForm({ ...carForm, sort_order: Number(e.target.value) })}
                  />
                </label>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={carForm.is_active}
                    onChange={(e) => setCarForm({ ...carForm, is_active: e.target.checked })}
                  />
                  Activo (visible en la web)
                </label>
              </div>
              <div className="admin-pending">
                <label className="btn btn-ghost-small file-label">
                  + Añadir fotos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      e.target.value = '';
                      if (files.length > 0) setPendingCarFiles((prev) => [...prev, ...makePending(files)]);
                    }}
                  />
                </label>
                {pendingCarFiles.length > 0 && (
                  <div className="admin-pending-previews">
                    {pendingCarFiles.map((pending, index) => (
                      <div className="admin-pending-thumb" key={`${pending.url}-${index}`}>
                        <img src={pending.url} alt="" />
                        <button
                          type="button"
                          aria-label="Quitar foto pendiente"
                          onClick={() =>
                            setPendingCarFiles((prev) => {
                              clearPending([prev[index]]);
                              return prev.filter((_, i) => i !== index);
                            })
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="admin-car-form-actions">
                <button className="btn btn-primary" onClick={handleSaveCar} disabled={carSaving}>
                  {carSaving ? 'Guardando…' : editingCarId ? 'Actualizar carro' : 'Crear carro'}
                </button>
                {editingCarId && (
                  <button type="button" className="btn btn-ghost-small" onClick={resetCarForm}>
                    Cancelar edición
                  </button>
                )}
              </div>
            </fieldset>

            {!carsLoaded ? (
              <p className="admin-hint">Cargando carros…</p>
            ) : cars.length === 0 ? (
              <p className="admin-hint">Aún no hay carros. Crea el primero arriba.</p>
            ) : (
              <ul className="admin-cars">
                {cars.map((car) => (
                  <li key={car.id} className={`admin-car-card ${car.is_active ? 'active' : 'inactive'}`}>
                    <div className="admin-car-head">
                      <h3>{car.name}</h3>
                      <span className={car.is_active ? 'badge badge-ok' : 'badge badge-wait'}>
                        {car.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className="admin-car-order">Orden: {car.sort_order}</span>
                    </div>
                    {car.details && <p className="admin-car-details">{car.details}</p>}
                    <p className="admin-car-desc">{car.description}</p>

                    <div className="admin-car-photos">
                      {car.photos && car.photos.length > 0 ? (
                        car.photos.map((photo) => (
                          <div key={photo} className="admin-car-photo">
                            <img src={photoUrl(photo, 400)} alt={car.name} />
                            <button className="btn btn-danger-small" onClick={() => removeCarPhoto(car, photo)}>
                              Quitar
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="admin-hint">Sin fotos</p>
                      )}
                    </div>

                    <div className="admin-car-actions">
                      <label className="btn btn-ghost-small file-label">
                        {carPhotoBusyId === car.id ? 'Subiendo…' : '+ Foto'}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          disabled={carPhotoBusyId === car.id}
                          onChange={(e) => handleCarPhotoUpload(car, e)}
                        />
                      </label>
                      <span className="admin-hint" style={{ margin: 0 }}>
                        {car.photos?.length ?? 0} fotos
                      </span>
                      <button className="btn btn-ghost-small" onClick={() => startEditCar(car)}>
                        Editar
                      </button>
                      <button className="btn btn-ghost-small" onClick={() => toggleCarActive(car)}>
                        {car.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button className="btn btn-danger-small" onClick={() => deleteCar(car)}>
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'comentarios' && (
          <section className="admin-panel">
            <h2>Comentarios</h2>
            {comments.length === 0 ? (
              <p className="admin-hint">Todavía no hay comentarios.</p>
            ) : (
              <ul className="admin-comments">
                {comments.map((comment) => (
                  <li key={comment.id} className={comment.approved ? 'approved' : 'pending'}>
                    <div className="admin-comment-head">
                      <strong>{comment.name}</strong>
                      <span className={comment.approved ? 'badge badge-ok' : 'badge badge-wait'}>
                        {comment.approved ? 'Publicado' : 'Pendiente'}
                      </span>
                      <time>
                        {new Date(comment.created_at).toLocaleDateString('es', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </time>
                    </div>
                    <p>{comment.message}</p>
                    <div className="admin-comment-actions">
                      {!comment.approved && (
                        <button className="btn btn-ghost-small" onClick={() => setApproved(comment, true)}>
                          Aprobar
                        </button>
                      )}
                      {comment.approved && (
                        <button className="btn btn-ghost-small" onClick={() => setApproved(comment, false)}>
                          Ocultar
                        </button>
                      )}
                      <button className="btn btn-danger-small" onClick={() => deleteComment(comment)}>
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === 'fotos' && (
          <section className="admin-panel">
            <h2>Fotos</h2>
            <p className="admin-hint">
              Sube fotos y asígnalas al hero (foto principal) o a la sección "Nosotros".
              Se mostrarán automáticamente tras publicarse el sitio (~2 minutos).
            </p>

            <div className="admin-upload">
              <label className="btn btn-primary file-label">
                {uploadBusy ? 'Subiendo…' : 'Subir fotos'}
                <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploadBusy} hidden />
              </label>
            </div>

            {uploads.length > 0 ? (
              <ul className="admin-uploads">
                {uploads.map((upload) => (
                  <li key={upload.id}>
                    <img src={photoUrl(`galeria/${upload.name}`, 300)} alt={upload.name} />
                    <div className="admin-upload-actions">
                      <button className="btn btn-ghost-small" onClick={() => assignPhoto(`galeria/${upload.name}`, 'hero_image_url')}>
                        Usar como foto principal
                      </button>
                      <button className="btn btn-ghost-small" onClick={() => assignPhoto(`galeria/${upload.name}`, 'about_image_url')}>
                        Usar en Nosotros
                      </button>
                      <button className="btn btn-danger-small" onClick={() => deleteUpload(upload)}>
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-hint">No hay fotos subidas todavía.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
