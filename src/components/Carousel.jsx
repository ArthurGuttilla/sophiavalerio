import { useState } from "react";
import { motion } from "framer-motion";

// Slide de imagem: tenta .jpg e, se falhar, .jpeg; senão, placeholder.
function PhotoSlide({ file, caption, delay, rise }) {
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

// Slide de vídeo: arquivo .mp4; se faltar, placeholder.
function VideoSlide({ file, delay, rise }) {
  const [failed, setFailed] = useState(false);
  const url = `${import.meta.env.BASE_URL}${file}.mp4`;

  return (
    <motion.figure className="carousel__item" {...(rise ? rise(delay) : {})}>
      {failed ? (
        <div className="carousel__ph">
          <span className="carousel__ph-icon" aria-hidden="true">▶</span>
          <span className="carousel__ph-text">vídeo em breve</span>
        </div>
      ) : (
        <video
          className="carousel__video"
          src={url}
          controls
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      )}
    </motion.figure>
  );
}

// Carrossel horizontal: cards lado a lado com deslize (scroll-snap), cada
// mídia mantendo a sua própria proporção (sem corte). Aceita fotos e vídeos.
export default function Carousel({ items = [], rise, delay = 0.3 }) {
  if (items.length === 0) return null;
  return (
    <div className="carousel">
      {items.map((it, i) =>
        it.type === "video" ? (
          <VideoSlide key={i} file={it.file} rise={rise} delay={delay + i * 0.08} />
        ) : (
          <PhotoSlide
            key={i}
            file={it.file}
            caption={it.caption}
            rise={rise}
            delay={delay + i * 0.08}
          />
        )
      )}
    </div>
  );
}
