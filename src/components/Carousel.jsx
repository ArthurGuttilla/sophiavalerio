import { useState } from "react";
import { motion } from "framer-motion";

// Tenta .jpg e, se falhar, .jpeg; se ainda assim falhar, mostra placeholder.
function Slide({ file, caption, delay, rise }) {
  const [stage, setStage] = useState(0); // 0=jpg, 1=jpeg, 2=placeholder
  const base = `${import.meta.env.BASE_URL}${file}`;
  const url = stage === 0 ? `${base}.jpg` : stage === 1 ? `${base}.jpeg` : null;

  return (
    <motion.figure className="carousel__item" {...(rise ? rise(delay) : {})}>
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
          <span className="carousel__ph-text">foto em breve</span>
        </div>
      )}
    </motion.figure>
  );
}

// Carrossel horizontal: cards lado a lado com deslize (scroll-snap), cada
// imagem mantendo a sua própria proporção (sem corte).
export default function Carousel({ items = [], rise, delay = 0.3 }) {
  if (items.length === 0) return null;
  return (
    <div className="carousel">
      {items.map((it, i) => (
        <Slide
          key={i}
          file={it.file}
          caption={it.caption}
          rise={rise}
          delay={delay + i * 0.1}
        />
      ))}
    </div>
  );
}
