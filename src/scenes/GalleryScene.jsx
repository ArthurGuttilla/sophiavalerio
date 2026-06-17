import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Um item de mídia (foto ou vídeo) com fallback automático: se o arquivo
// ainda não existir, mostra um placeholder elegante no lugar.
function MediaItem({ item, rise, delay }) {
  const [failed, setFailed] = useState(false);
  const url = `${import.meta.env.BASE_URL}${item.src}`;
  const isVideo = item.type === "video";

  return (
    <motion.figure className="gallery__item" {...rise(delay)}>
      {failed ? (
        <div className={isVideo ? "exp__video-ph" : "exp__photo-ph"}>
          <span className={isVideo ? "exp__video-ph-icon" : "exp__photo-icon"} aria-hidden="true">
            {isVideo ? "▶" : "📷"}
          </span>
          <span className={isVideo ? "exp__video-ph-text" : "exp__photo-text"}>
            {item.caption || (isVideo ? "vídeo em breve" : "foto em breve")}
          </span>
        </div>
      ) : isVideo ? (
        <video
          className="exp__video-el"
          src={url}
          controls
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      ) : (
        <img
          className="exp__photo-img"
          src={url}
          alt={item.caption || ""}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      {item.caption && !failed && (
        <figcaption className="gallery__cap">{item.caption}</figcaption>
      )}
    </motion.figure>
  );
}

// Dia com vários itens de mídia (fotos e vídeo) em coluna.
export default function GalleryScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const items = d.gallery || [];

  return (
    <motion.main
      className="exp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {d.junina && (
        <div className="junina" aria-hidden="true">
          <div className="junina__flags">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className={`junina__flag junina__flag--${i % 4}`} />
            ))}
          </div>
          {!reduce && (
            <div className="junina__floats">
              {["🎈", "🌽", "🔥", "✨", "🎉", "🇧🇷"].map((e, i) => (
                <motion.span
                  key={i}
                  className="junina__float"
                  style={{ left: `${8 + i * 15}%` }}
                  initial={{ y: "10vh", opacity: 0 }}
                  animate={{ y: "-110vh", opacity: [0, 0.7, 0.7, 0] }}
                  transition={{ duration: 12 + i * 2, delay: i * 1.5, repeat: Infinity, ease: "linear" }}
                >
                  {e}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      )}

      <ExpBack onClick={onBack} />
      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />

        <div className="gallery">
          {items.map((item, i) => (
            <MediaItem key={i} item={item} rise={rise} delay={0.3 + i * 0.1} />
          ))}
        </div>

        <ExpStory d={d} rise={rise} base={0.5} />

        <ExpFoot rise={rise} delay={0.9} onBack={onBack} />
      </article>
    </motion.main>
  );
}
