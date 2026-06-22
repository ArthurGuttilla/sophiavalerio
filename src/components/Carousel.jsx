import { useRef, useState } from "react";
import { motion } from "framer-motion";

// Tenta .jpg e, se falhar, .jpeg; se ainda assim falhar, mostra placeholder.
function Slide({ file, caption }) {
  const [stage, setStage] = useState(0); // 0=jpg, 1=jpeg, 2=placeholder
  const base = `${import.meta.env.BASE_URL}${file}`;
  const url = stage === 0 ? `${base}.jpg` : stage === 1 ? `${base}.jpeg` : null;

  return (
    <figure className="carousel__slide">
      {url ? (
        <img
          className="carousel__img"
          src={url}
          alt={caption || ""}
          loading="lazy"
          onError={() => setStage((s) => s + 1)}
        />
      ) : (
        <div className="carousel__ph">
          <span className="carousel__ph-icon" aria-hidden="true">📷</span>
          <span className="carousel__ph-text">{caption || "foto em breve"}</span>
        </div>
      )}
      {caption && <figcaption className="carousel__cap">{caption}</figcaption>}
    </figure>
  );
}

// Carrossel horizontal com deslize (scroll-snap) e bolinhas de navegação.
export default function Carousel({ items = [], rise, delay = 0.3 }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  }
  function goTo(i) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <motion.div className="carousel" {...(rise ? rise(delay) : {})}>
      <div className="carousel__track" ref={trackRef} onScroll={onScroll}>
        {items.map((it, i) => (
          <Slide key={i} file={it.file} caption={it.caption} />
        ))}
      </div>
      {items.length > 1 && (
        <div className="carousel__dots" role="tablist" aria-label="fotos">
          {items.map((_, i) => (
            <button
              key={i}
              className={`carousel__dot ${i === active ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`foto ${i + 1}`}
              aria-selected={i === active}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
