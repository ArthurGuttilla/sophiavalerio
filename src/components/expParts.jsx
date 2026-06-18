import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

// Hook that returns a `rise(delay)` helper for staggered entrances.
export function useRise() {
  const reduce = useReducedMotion();
  return (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });
}

export function spotifyEmbed(url) {
  return url.replace("open.spotify.com/", "open.spotify.com/embed/");
}

export function ExpBack({ onClick }) {
  return (
    <button className="exp__close" onClick={onClick} aria-label="voltar">
      ← datas
    </button>
  );
}

export function ExpHeader({ d, rise }) {
  return (
    <>
      <motion.p className="exp__date" {...rise(0.05)}>{d.dateLabel}</motion.p>
      <motion.p className="exp__kicker" {...rise(0.12)}>{d.kicker}</motion.p>
      <motion.h1 className="exp__title" {...rise(0.18)}>{d.title}</motion.h1>
    </>
  );
}

export function ExpStory({ d, rise, base = 0.3 }) {
  return (
    <div className="exp__story">
      {d.story.map((p, i) => (
        <motion.p key={i} {...rise(base + i * 0.12)}>{p}</motion.p>
      ))}
    </div>
  );
}

export function ExpQuote({ d, rise, delay }) {
  if (!d.quote) return null;
  return (
    <motion.blockquote className="exp__quote" {...rise(delay)}>
      <span className="exp__quote-mark" aria-hidden="true">“</span>
      <span className="exp__quote-text">“{d.quote}”</span>
      {d.quoteAfter && <span className="exp__quote-after">{d.quoteAfter}</span>}
    </motion.blockquote>
  );
}

export function ExpMedia({ d, rise, delay }) {
  if (!d.media || d.media.length === 0) return null;
  return (
    <motion.div className="exp__media" {...rise(delay)}>
      {d.media.map((m, i) =>
        m.type === "spotify" ? (
          <div className="exp__spotify" key={i}>
            <iframe
              title={m.label}
              src={spotifyEmbed(m.url)}
              width="100%"
              height="352"
              frameBorder="0"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        ) : (
          <a
            key={i}
            className="btn btn--ghost"
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            ♪ {m.label}
          </a>
        )
      )}
    </motion.div>
  );
}

export function ExpVideo({ d, rise, delay }) {
  // Vídeo real (quando o arquivo existir) ou um placeholder elegante.
  // Se o arquivo ainda não foi enviado (erro ao carregar), cai no placeholder.
  const [failed, setFailed] = useState(false);
  if (!d.video && !d.videoPlaceholder) return null;
  const src = d.video && !failed ? `${import.meta.env.BASE_URL}${d.video}` : null;
  return (
    <motion.div className="exp__video" {...rise(delay)}>
      {src ? (
        <video
          className="exp__video-el"
          src={src}
          controls
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="exp__video-ph">
          <span className="exp__video-ph-icon" aria-hidden="true">▶</span>
          <span className="exp__video-ph-text">{d.videoPlaceholder}</span>
        </div>
      )}
    </motion.div>
  );
}

// Foto da data: mostra a imagem real; se o arquivo ainda não existir
// (onError), cai automaticamente no placeholder elegante.
export function ExpPhoto({ d, rise, delay }) {
  const [failed, setFailed] = useState(false);
  if (!d.photo && !d.photoPlaceholder) return null;
  const src = d.photo && !failed ? `${import.meta.env.BASE_URL}${d.photo}` : null;
  return (
    <motion.figure className="exp__photo" {...rise(delay)}>
      {src ? (
        <img
          className="exp__photo-img"
          src={src}
          alt={d.photoPlaceholder || ""}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="exp__photo-ph">
          <span className="exp__photo-icon" aria-hidden="true">📷</span>
          <span className="exp__photo-text">{d.photoPlaceholder}</span>
        </div>
      )}
    </motion.figure>
  );
}

// Player de vídeo/música do YouTube (16:9 responsivo), igual ao usado no 27/04.
export function ExpYoutube({ videoId, rise, delay }) {
  if (!videoId) return null;
  return (
    <motion.div className="exp__yt" {...rise(delay)}>
      <div className="exp__yt-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="música"
          loading="lazy"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    </motion.div>
  );
}

export function ExpFoot({ rise, delay }) {
  return (
    <motion.div className="exp__foot" {...rise(delay)}>
      <p className="signoff">para Sophia, com amor</p>
    </motion.div>
  );
}
