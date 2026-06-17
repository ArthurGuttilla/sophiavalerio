import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpFoot, ExpPhoto,
} from "../components/expParts.jsx";

// Dia 08/06 — o reencontro: uma troca curta de mensagens, a narrativa do
// dia com a foto do reencontro no meio, e a reação final em destaque.
export default function ReunionScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const msgs = d.chat || [];
  const story = d.story || [];
  const photoBefore = typeof d.photoBefore === "number" ? d.photoBefore : -1;

  const [shown, setShown] = useState(reduce ? msgs.length : 0);
  const [typing, setTyping] = useState(false);
  const timers = useRef([]);
  const threadRef = useRef(null);

  useEffect(() => {
    if (reduce) return;
    let t = 700;
    msgs.forEach((_, i) => {
      timers.current.push(setTimeout(() => setTyping(true), t));
      t += 1100;
      timers.current.push(setTimeout(() => { setTyping(false); setShown(i + 1); }, t));
      t += 650;
    });
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown, typing]);

  const photoBlock = (d.photo || d.photoPlaceholder) && (
    <ExpPhoto d={d} rise={rise} delay={0.5} />
  );

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

        {/* Conversa */}
        <motion.div className="chat" {...rise(0.3)}>
          <div className="chat__bar">
            <span className="chat__avatar" aria-hidden="true">S</span>
            <span className="chat__who">
              <span className="chat__name">Sophia Valerio Feat</span>
              <span className="chat__status">online</span>
            </span>
          </div>
          <div className="chat__thread" ref={threadRef}>
            {msgs.slice(0, shown).map((m, i) => (
              <motion.div
                key={i}
                className={`chat__msg chat__msg--${m.from === "me" ? "me" : "her"}`}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="chat__text">{m.text}</span>
                {m.time && <span className="chat__time">{m.time}</span>}
              </motion.div>
            ))}
            {typing && (
              <div className="chat__msg chat__msg--her chat__msg--typing">
                <span className="chat__dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
            )}
          </div>
        </motion.div>

        {/* História, com a foto inserida no ponto marcado */}
        <div className="exp__story">
          {story.map((p, i) => (
            <div key={i}>
              {i === photoBefore && photoBlock}
              <motion.p {...rise(0.5 + i * 0.12)}>{p}</motion.p>
            </div>
          ))}
        </div>

        {/* Reação final em destaque */}
        {d.reaction && (
          <motion.p className="reaction" {...rise(0.5 + story.length * 0.12 + 0.1)}>
            {d.reaction}
          </motion.p>
        )}

        <ExpFoot rise={rise} delay={0.5 + story.length * 0.12 + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
