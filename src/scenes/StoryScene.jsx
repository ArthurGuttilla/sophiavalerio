import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRise, ExpBack, ExpFoot } from "../components/expParts.jsx";

// An Instagram-stories evocation: progress bars at the top, tap-to-advance
// frames, a profile header with the "seguir" button that flips to "seguindo".
const FRAMES = [
  {
    tag: "@arthur",
    big: "um stories\nqualquer",
    small: "Era só mais um post no feed de um aluno meu.",
  },
  {
    tag: "o acaso",
    big: "você\ndeslizou\naté aqui",
    small: "Sem querer, o algoritmo nos apresentou.",
  },
  {
    tag: "06 de abril",
    big: "você\ntocou\nseguir",
    small: "E um fio invisível ligou as nossas vidas.",
  },
  {
    tag: "depois disso",
    big: "tudo\ncomeçou",
    small: "Esse foi o primeiro capítulo de nós.",
  },
];
const FRAME_MS = 3200;

export default function StoryScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [following, setFollowing] = useState(false);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  const isLast = i >= FRAMES.length - 1;

  useEffect(() => {
    if (reduce || paused) return;
    timer.current = setTimeout(() => {
      setI((v) => Math.min(v + 1, FRAMES.length - 1));
      if (i === 2) setFollowing(true); // flip on the "seguir" frame
    }, FRAME_MS);
    return () => clearTimeout(timer.current);
  }, [i, paused, reduce]);

  const next = () => {
    setI((v) => Math.min(v + 1, FRAMES.length - 1));
    if (i >= 2) setFollowing(true);
  };
  const prev = () => setI((v) => Math.max(v - 1, 0));

  const frame = FRAMES[i];

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
        <motion.p className="exp__date" {...rise(0.05)}>{d.dateLabel}</motion.p>

        <motion.div className="story" {...rise(0.15)}>
          {/* progress bars */}
          <div className="story__bars">
            {FRAMES.map((_, idx) => (
              <span key={idx} className="story__bar">
                <span
                  className="story__barfill"
                  style={{
                    width: idx < i ? "100%" : idx === i ? (reduce ? "100%" : undefined) : "0%",
                    animation:
                      idx === i && !reduce && !paused
                        ? `storyfill ${FRAME_MS}ms linear forwards`
                        : "none",
                  }}
                />
              </span>
            ))}
          </div>

          {/* header */}
          <div className="story__head">
            <span className="story__avatar" aria-hidden="true">S</span>
            <span className="story__user">feat.sophia</span>
            <button
              className={`story__follow ${following ? "is-following" : ""}`}
              onClick={() => setFollowing((f) => !f)}
            >
              {following ? "seguindo ✓" : "seguir"}
            </button>
          </div>

          {/* frame body — tap zones */}
          <div
            className="story__stage"
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerLeave={() => setPaused(false)}
          >
            <button className="story__tap story__tap--l" onClick={prev} aria-label="anterior" />
            <button className="story__tap story__tap--r" onClick={next} aria-label="próximo" />
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                className="story__frame"
                initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="story__tag">{frame.tag}</span>
                <h2 className="story__big">{frame.big}</h2>
                <p className="story__small">{frame.small}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {isLast && (
          <motion.div
            className="story__story"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {d.story.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </motion.div>
        )}

        <ExpFoot rise={rise} delay={0.4} onBack={onBack} />
      </article>
    </motion.main>
  );
}
