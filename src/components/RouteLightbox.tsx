import { useCallback, useEffect, useRef, useState } from 'react';
import { getUi, type UiStrings } from '../i18n/ui';
import './lightbox.css';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const storageBase = supabaseUrl
  ? `${supabaseUrl}/storage/v1/render/image/public/fotos/`
  : '/';

type LightboxState = {
  photos: string[];
  title: string;
  index: number;
} | null;

type Props = {
  strings?: Pick<
    UiStrings,
    'lbPhotosOfTitle' | 'lbGallery' | 'lbClose' | 'lbPrevPhoto' | 'lbNextPhoto'
  >;
};

export default function RouteLightbox({ strings }: Props) {
  const t = {
    lbPhotosOfTitle: strings?.lbPhotosOfTitle ?? getUi('es').lbPhotosOfTitle,
    lbGallery: strings?.lbGallery ?? getUi('es').lbGallery,
    lbClose: strings?.lbClose ?? getUi('es').lbClose,
    lbPrevPhoto: strings?.lbPrevPhoto ?? getUi('es').lbPrevPhoto,
    lbNextPhoto: strings?.lbNextPhoto ?? getUi('es').lbNextPhoto,
  };
  const [state, setState] = useState<LightboxState>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    const open = (event: Event) => {
      const detail = (event as CustomEvent).detail ?? {};
      if (!Array.isArray(detail.photos) || detail.photos.length === 0) return;
      setState({
        photos: detail.photos,
        title: typeof detail.title === 'string' ? detail.title : '',
        index: Math.min(Math.max(0, Number(detail.index) || 0), detail.photos.length - 1),
      });
    };
    window.addEventListener('route-lightbox:open', open);
    return () => window.removeEventListener('route-lightbox:open', open);
  }, []);

  const close = useCallback(() => setState(null), []);

  const step = useCallback((dir: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = (prev.index + dir + prev.photos.length) % prev.photos.length;
      return { ...prev, index: next };
    });
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [state, close, step]);

  if (!state) return null;

  const photoSrc = `${storageBase}${state.photos[state.index]}?width=1400&quality=82`;

  return (
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={
        state.title
          ? t.lbPhotosOfTitle.replace('{title}', state.title)
          : t.lbGallery
      }
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
        touchDeltaX.current = 0;
      }}
      onTouchMove={(event) => {
        touchDeltaX.current = event.touches[0].clientX - touchStartX.current;
      }}
      onTouchEnd={() => {
        if (Math.abs(touchDeltaX.current) > 40) step(touchDeltaX.current < 0 ? 1 : -1);
      }}
    >
      <button className="lightbox-close" type="button" aria-label={t.lbClose} onClick={close}>
        ×
      </button>

      {state.photos.length > 1 && (
        <>
          <button
            className="lightbox-arrow lightbox-prev"
            type="button"
            aria-label={t.lbPrevPhoto}
            onClick={() => step(-1)}
          >
            ‹
          </button>
          <button
            className="lightbox-arrow lightbox-next"
            type="button"
            aria-label={t.lbNextPhoto}
            onClick={() => step(1)}
          >
            ›
          </button>
        </>
      )}

      <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
        <img key={photoSrc} src={photoSrc} alt={state.title} />
        <figcaption className="lightbox-caption">
          {state.title && <span className="lightbox-title">{state.title}</span>}
          <span className="lightbox-counter">
            {state.index + 1} / {state.photos.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
