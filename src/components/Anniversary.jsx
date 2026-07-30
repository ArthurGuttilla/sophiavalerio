import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { formatSince } from "../dateUtils.js";

// Comemorações mensais:
//  - dia 06: estrelinhas + "há quanto tempo estão saindo" (desde 06/04/2026)
//  - dia 20: corações + "há quanto tempo escolheram namorar" (desde 20/06/2026)
function getConfig(day) {
  if (day === 6) {
    return {
      key: "saindo",
      emojis: ["⭐", "✨", "🌟"],
      title: "Dia 6 🌟",
      message: `Sophia e Arthur estão saindo há ${formatSince(2026, 3, 6)}.`,
    };
  }
  if (day === 20) {
    return {
      key: "namorar",
      emojis: ["❤️", "💕", "💖"],
      title: "Dia 20 ❤️",
      message: `Sophia e Arthur escolheram se namorar há ${formatSince(2026, 5, 20)}.`,
    };
  }
  return null;
}

export default function Anniversary() {
  const reduce = useReducedMotion();
  const cfg = useMemo(() => getConfig(new Date().getDate()), []);
  const [show, setShow] = useState(() => {
    if (!cfg) return false;
    try {
      return sessionStorage.getItem(`sv_anniv_${cfg.key}`) !== "1";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (cfg && show) {
      try { sessionStorage.setItem(`sv_anniv_${cfg.key}`, "1"); } catch { /* ignore */ }
    }
  }, [cfg, show]);

  // Campo de emojis caindo (confete temático).
  const rain = useMemo(() => {
    if (!cfg) return [];
    let seed = cfg.key.length * 97 + 13;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 34 }, (_, i) => ({
      emoji: cfg.emojis[i % cfg.emojis.length],
      left: rnd() * 100,
      delay: rnd() * 1.6,
      dur: 3.2 + rnd() * 2.6,
      size: 1.1 + rnd() * 1.6,
      drift: (rnd() - 0.5) * 60,
    }));
  }, [cfg]);

  if (!cfg || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="anniv"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="anniv__backdrop" onClick={() => setShow(false)} />

        {!reduce && (
          <div className="anniv__rain" aria-hidden="true">
            {rain.map((p, i) => (
              <motion.span
                key={i}
                className="anniv__drop"
                style={{ left: `${p.left}%`, fontSize: `${p.size}rem` }}
                initial={{ y: "-12vh", x: 0, opacity: 0, rotate: 0 }}
                animate={{ y: "112vh", x: p.drift, opacity: [0, 1, 1, 0.9], rotate: 180 }}
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
              >
                {p.emoji}
              </motion.span>
            ))}
          </div>
        )}

        <motion.div
          className="anniv__card"
          initial={{ scale: reduce ? 1 : 0.8, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
        >
          <span className="anniv__emoji" aria-hidden="true">{cfg.emojis[0]}</span>
          <p className="anniv__title">{cfg.title}</p>
          <p className="anniv__message">{cfg.message}</p>
          <button className="btn" onClick={() => setShow(false)}>fechar</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
