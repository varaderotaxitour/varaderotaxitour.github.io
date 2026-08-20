import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './comments.css';

type Comment = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('comments')
      .select('id, name, message, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) setComments(data as Comment[]);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!supabase) {
      setError('Los comentarios no están disponibles ahora mismo.');
      return;
    }
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (cleanName.length < 2 || cleanName.length > 60) {
      setError('Escribe tu nombre (entre 2 y 60 caracteres).');
      return;
    }
    if (cleanMessage.length < 2 || cleanMessage.length > 1000) {
      setError('Escribe un comentario (entre 2 y 1000 caracteres).');
      return;
    }
    setSubmitting(true);
    const { error: insertError } = await supabase
      .from('comments')
      .insert({ name: cleanName, message: cleanMessage });
    setSubmitting(false);
    if (insertError) {
      setError('No se pudo enviar el comentario. Inténtalo de nuevo.');
      return;
    }
    setSent(true);
    setName('');
    setMessage('');
  }

  return (
    <div className="comments-wrap">
      {loading ? (
        <p className="comments-empty">Cargando comentarios…</p>
      ) : comments.length === 0 ? (
        <p className="comments-empty">
          Sé el primero en dejar un comentario.
        </p>
      ) : (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li className="comment-card" key={comment.id}>
              <div className="comment-head">
                <span className="comment-name">{comment.name}</span>
                <time className="comment-date">
                  {new Date(comment.created_at).toLocaleDateString('es', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <p className="comment-message">{comment.message}</p>
            </li>
          ))}
        </ul>
      )}

      {sent ? (
        <p className="comments-sent">
          ¡Gracias! Tu comentario se publicará en cuanto lo revisemos.
        </p>
      ) : (
        <form className="comment-form" onSubmit={handleSubmit}>
          <h3>Deja tu comentario</h3>
          <label>
            Nombre
            <input
              type="text"
              value={name}
              maxLength={60}
              placeholder="Tu nombre"
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label>
            Mensaje
            <textarea
              value={message}
              maxLength={1000}
              rows={4}
              placeholder="Cuéntanos tu experiencia…"
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </label>
          {error && <p className="comment-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Enviando…' : 'Enviar comentario'}
          </button>
        </form>
      )}
    </div>
  );
}