import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Dia 15/06 — o nosso combinado: quando brigar, luva sem perder o amor.
// Joguinho estilo Guitar Hero: em cada trilha (uma por luva) descem emojis.
// Acertar a briga 🥊 com a luva = +1. Acertar o coração ❤️ = -3 (não pode!).
// Deixe o coração passar. 15 segundos de jogo.
const GAME_MS = 15000;
const FALL_MS = 2000; // tempo de descida (topo -> base)
const HIT_LINE = 84; // linha da luva (em %)
const HIT_MIN = 70;
const HIT_MAX = 99;

export default function BoxingScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  const [status, setStatus] = useState("idle"); // idle | playing | done
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_MS / 1000);
  const [notes, setNotes] = useState([]);
  const [pops, setPops] = useState([]);
  const notesRef = useRef([]);
  const popTimers = useRef([]);

  function start() {
    notesRef.current = [];
    setNotes([]);
    setPops([]);
    setScore(0);
    setTime(GAME_MS / 1000);
    setStatus("playing");
  }

  // Loop do jogo: move e cria os emojis nas duas trilhas.
  useEffect(() => {
    if (status !== "playing") return;
    let raf;
    let last = performance.now();
    const startT = last;
    let lastSpawn = 0;
    let gap = 450;

    function loop(now) {
      const elapsed = now - startT;
      if (elapsed >= GAME_MS) {
        setStatus("done");
        return;
      }
      setTime(Math.max(0, Math.ceil((GAME_MS - elapsed) / 1000)));

      const dt = now - last;
      last = now;

      const spawn = now - lastSpawn > gap;
      if (spawn) {
        lastSpawn = now;
        gap = 480 + Math.random() * 420;
      }

      let arr = notesRef.current
        .map((n) => ({ ...n, y: n.y + (110 / FALL_MS) * dt }))
        .filter((n) => n.y < 114);
      if (spawn) {
        arr.push({
          id: now + Math.random(),
          lane: Math.random() < 0.5 ? "l" : "r",
          type: Math.random() < 0.58 ? "fight" : "heart",
          y: -10,
        });
      }
      notesRef.current = arr;
      setNotes(arr);

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [status]);

  useEffect(
    () => () => popTimers.current.forEach((t) => clearTimeout(t)),
    []
  );

  function tap(lane) {
    if (status !== "playing") return;
    const cands = notesRef.current.filter(
      (n) => n.lane === lane && n.y >= HIT_MIN && n.y <= HIT_MAX
    );
    if (cands.length === 0) return; // socou no vazio
    cands.sort((a, b) => Math.abs(a.y - HIT_LINE) - Math.abs(b.y - HIT_LINE));
    const hit = cands[0];

    notesRef.current = notesRef.current.filter((n) => n.id !== hit.id);
    setNotes(notesRef.current.slice());

    const delta = hit.type === "fight" ? 1 : -3;
    setScore((s) => s + delta);

    const id = Date.now() + Math.random();
    setPops((p) => [...p, { id, lane, good: delta > 0, text: delta > 0 ? "+1" : "-3" }]);
    const t = setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 600);
    popTimers.current.push(t);
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

        <motion.div className="ghero" {...rise(0.3)}>
          <div className="ghero__hud">
            <span>🥊 {score} pts</span>
            <span>{status === "playing" ? `${time}s` : "15 segundos"}</span>
          </div>

          <div className="ghero__board">
            {/* trilhas + notas */}
            {status === "playing" && (
              <>
                <div className="ghero__lane ghero__lane--l" />
                <div className="ghero__lane ghero__lane--r" />
                <div className="ghero__hitline" aria-hidden="true" />

                {notes.map((n) => (
                  <span
                    key={n.id}
                    className={`ghero__note ghero__note--${n.lane}`}
                    style={{ top: `${n.y}%` }}
                    aria-hidden="true"
                  >
                    {n.type === "fight" ? "🥊" : "❤️"}
                  </span>
                ))}

                <AnimatePresence>
                  {pops.map((p) => (
                    <motion.span
                      key={p.id}
                      className={`ghero__pop ${p.good ? "is-good" : "is-bad"} ghero__pop--${p.lane}`}
                      initial={{ opacity: 0, y: 0, scale: 0.6 }}
                      animate={{ opacity: 1, y: -40, scale: 1.1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55 }}
                    >
                      {p.text}
                    </motion.span>
                  ))}
                </AnimatePresence>

                <div className="ghero__gloves">
                  <motion.button
                    className="boxe__glove boxe__glove--l"
                    onPointerDown={() => tap("l")}
                    aria-label="luva esquerda"
                    whileTap={reduce ? {} : { scale: 0.82, rotate: -14 }}
                    transition={{ duration: 0.1 }}
                  >
                    🥊
                  </motion.button>
                  <motion.button
                    className="boxe__glove boxe__glove--r"
                    onPointerDown={() => tap("r")}
                    aria-label="luva direita"
                    whileTap={reduce ? {} : { scale: 0.82, rotate: 14 }}
                    transition={{ duration: 0.1 }}
                  >
                    🥊
                  </motion.button>
                </div>
              </>
            )}

            {status === "idle" && (
              <div className="boxe__overlay">
                <p>
                  Soque a briga 🥊 com a luva quando ela descer na trilha (+1).
                  Mas nunca acerte o coração ❤️ (-3), deixe ele passar. 15 segundos!
                </p>
                <button className="btn" onClick={start}>subir no ringue</button>
              </div>
            )}

            {status === "done" && (
              <div className="boxe__overlay">
                <p className="boxe__result">{score} pts</p>
                <p className="boxe__quip">
                  {score >= 8
                    ? "Você bate na briga e protege o amor. É esse o nosso combinado."
                    : "O segredo é nunca socar o amor. A briga, essa, a gente encara junto."}
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
