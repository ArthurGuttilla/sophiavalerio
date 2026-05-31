import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Música de fundo de uma data. Toca em loop, com fade-in suave e um botão
// discreto de som. Como navegadores bloqueiam autoplay com som, a música
// começa de fato no primeiro toque/gesto do usuário na página.
//
// `pausedExternally` (ex.: quando o player do Spotify é acionado) silencia
// e pausa esta trilha para não competir com a música escolhida.
export default function BgAudio({ src, label, pausedExternally = false }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const fadeTimer = useRef(null);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  const url = `${import.meta.env.BASE_URL}${src}`;

  // Fade helper.
  function fadeTo(target, ms = 800) {
    const el = ref.current;
    if (!el) return;
    clearInterval(fadeTimer.current);
    const steps = 24;
    const start = el.volume;
    let i = 0;
    fadeTimer.current = setInterval(() => {
      i++;
      el.volume = Math.max(0, Math.min(1, start + (target - start) * (i / steps)));
      if (i >= steps) clearInterval(fadeTimer.current);
    }, ms / steps);
  }

  // Tenta iniciar a reprodução (após gesto do usuário).
  function tryPlay() {
    const el = ref.current;
    if (!el || muted || pausedExternally || reduce) return;
    el.volume = 0;
    const p = el.play();
    if (p && p.catch) p.catch(() => {});
    fadeTo(0.45);
    setReady(true);
  }

  // Primeiro gesto na página dá início à trilha.
  useEffect(() => {
    if (reduce) return;
    const onFirst = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst);
    window.addEventListener("keydown", onFirst);
    return () => {
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, muted, pausedExternally]);

  // Pausa externa (Spotify) silencia esta trilha.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (pausedExternally) {
      fadeTo(0, 500);
      const t = setTimeout(() => el.pause(), 520);
      return () => clearTimeout(t);
    } else if (ready && !muted && !reduce) {
      el.play().catch(() => {});
      fadeTo(0.45);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pausedExternally]);

  function toggleMute() {
    const el = ref.current;
    if (!el) return;
    if (muted) {
      setMuted(false);
      el.play().catch(() => {});
      fadeTo(0.45);
      setReady(true);
    } else {
      setMuted(true);
      fadeTo(0, 400);
      setTimeout(() => el.pause(), 420);
    }
  }

  useEffect(() => () => clearInterval(fadeTimer.current), []);

  if (reduce) return null;

  return (
    <>
      <audio ref={ref} src={url} loop preload="auto" />
      <motion.button
        className={`bgaudio ${muted || pausedExternally ? "is-muted" : "is-on"}`}
        onClick={toggleMute}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        aria-label={muted ? `Tocar ${label}` : `Silenciar ${label}`}
        title={label}
      >
        <span className="bgaudio__icon" aria-hidden="true">
          {muted || pausedExternally ? "♪̶" : "♪"}
        </span>
        <span className="bgaudio__label">{label}</span>
      </motion.button>
    </>
  );
}
