import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Dia 15/06 — o nosso combinado: quando brigar, três minutos de luva sem
// perder o amor. Um joguinho rápido: toque na luva para socar.
const ROUND_MS = 20000;

export default function BoxingScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  const [state, setState] = useState("idle"); // idle | playing | done
  const [hits, setHits] = useState(0);
  const [time, setTime] = useState(ROUND_MS / 1000);
  const [pops, setPops] = useState([]); // efeitos de impacto
  const [whack, setWhack] = useState(0); // retriggera a animação do saco
  const timers = useRef([]);

  function start() {
    setHits(0);
    setTime(ROUND_MS / 1000);
    setPops([]);
    setState("playing");
  }

  useEffect(() => {
    if (state !== "playing") return;
    const tick = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    const end = setTimeout(() => setState("done"), ROUND_MS);
    timers.current.push(tick, end);
    return () => { clearInterval(tick); clearTimeout(end); };
  }, [state]);

  useEffect(() => () => timers.current.forEach((t) => { clearTimeout(t); clearInterval(t); }), []);

  function punch() {
    if (state !== "playing") return;
    setHits((h) => h + 1);
    setWhack((w) => w + 1);
    const id = Date.now() + Math.random();
    const x = 30 + Math.random() * 40;
    setPops((p) => [...p, { id, x, emoji: Math.random() < 0.25 ? "❤️" : "💥" }]);
    const t = setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 650);
    timers.current.push(t);
  }

  return (
    <motion.main
      className="exp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ExpBack onClick={onBack} />
      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />

        <motion.div className="boxe" {...rise(0.3)}>
          <div className="boxe__hud">
            <span>🥊 {hits}</span>
            <span>{state === "playing" ? `${time}s` : "round rápido"}</span>
          </div>

          <div className="boxe__ring">
            {/* pops de impacto */}
            <AnimatePresence>
              {pops.map((p) => (
                <motion.span
                  key={p.id}
                  className="boxe__pop"
                  style={{ left: `${p.x}%` }}
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: 1, y: -50, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {p.emoji}
                </motion.span>
              ))}
            </AnimatePresence>

            {state === "idle" && (
              <div className="boxe__overlay">
                <p>Nosso combinado: brigou? Três minutos de luva, sem perder o amor.</p>
                <button className="btn" onClick={start}>subir no ringue</button>
              </div>
            )}

            {state === "playing" && (
              <motion.button
                className="boxe__bag"
                onClick={punch}
                aria-label="socar"
                animate={reduce ? {} : { rotate: [0, -6, 5, 0], scale: [1, 0.94, 1] }}
                transition={{ duration: 0.18 }}
                key={whack}
              >
                🥊
              </motion.button>
            )}

            {state === "done" && (
              <div className="boxe__overlay">
                <p className="boxe__result">{hits} socos 🥊</p>
                <p className="boxe__quip">
                  {hits >= 30
                    ? "Que jab! Mas a melhor luta termina sempre em abraço."
                    : "Briga boa é a nossa: três minutos e, no fim, abraço."}
                </p>
                <button className="btn btn--ghost" onClick={start}>de novo</button>
              </div>
            )}
          </div>
        </motion.div>

        <ExpStory d={d} rise={rise} base={0.45} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
