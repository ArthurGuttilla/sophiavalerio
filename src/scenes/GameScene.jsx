import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Um joguinho bobo e curto: aparecem corações por alguns segundos; toque
// neles para marcar pontos. Leve, só para a página ser interativa.
const ROUND_MS = 12000;

export default function GameScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  const [state, setState] = useState("idle"); // idle | playing | done
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [time, setTime] = useState(ROUND_MS / 1000);
  const timers = useRef([]);
  const idRef = useRef(0);

  function clearAll() {
    timers.current.forEach(clearTimeout);
    timers.current.forEach(clearInterval);
    timers.current = [];
  }

  function spawn() {
    const id = ++idRef.current;
    const heart = {
      id,
      x: 8 + Math.random() * 84, // %
      y: 12 + Math.random() * 70,
      emoji: Math.random() < 0.18 ? "💀" : "❤️", // caveira = pega tema da data, tira ponto
    };
    setHearts((h) => [...h, heart]);
    // some sozinho
    timers.current.push(
      setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 1300)
    );
  }

  function start() {
    setScore(0);
    setHearts([]);
    setTime(ROUND_MS / 1000);
    setState("playing");
  }

  useEffect(() => {
    if (state !== "playing") return;
    const spawnInt = setInterval(spawn, 600);
    const tick = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    const end = setTimeout(() => {
      setState("done");
      setHearts([]);
    }, ROUND_MS);
    timers.current.push(spawnInt, tick, end);
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function tapHeart(h) {
    setHearts((hs) => hs.filter((x) => x.id !== h.id));
    setScore((s) => s + (h.emoji === "❤️" ? 1 : -1));
  }

  useEffect(() => () => clearAll(), []);

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

        <motion.div className="game" {...rise(0.3)}>
          <div className="game__hud">
            <span>❤️ {score}</span>
            <span>{state === "playing" ? `${time}s` : "jogo rápido"}</span>
          </div>

          <div className="game__board">
            {state === "idle" && (
              <div className="game__overlay">
                <p>Pegue os corações. Cuidado com as caveiras. 💀</p>
                <button className="btn" onClick={start}>começar</button>
              </div>
            )}

            {state === "playing" &&
              !reduce &&
              hearts.map((h) => (
                <motion.button
                  key={h.id}
                  className="game__heart"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => tapHeart(h)}
                  aria-label={h.emoji === "❤️" ? "coração" : "caveira"}
                >
                  {h.emoji}
                </motion.button>
              ))}

            {state === "playing" && reduce && (
              <div className="game__overlay">
                <p>Animações reduzidas — toque para somar.</p>
                <button className="btn" onClick={() => setScore((s) => s + 1)}>❤️ +1</button>
                <button className="btn btn--ghost" onClick={() => setState("done")}>terminar</button>
              </div>
            )}

            {state === "done" && (
              <div className="game__overlay">
                <p className="game__result">
                  {score} {score === 1 ? "coração" : "corações"} 🤍
                </p>
                <p className="game__quip">
                  {score >= 10
                    ? "Reflexos de quem não deixa o amor escapar."
                    : "O que importa é que a gente continua jogando — junto."}
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
