import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Simula uma conversa de WhatsApp: as mensagens aparecem aos poucos, com
// um indicador de "digitando" antes de cada uma — o dia da declaração.
export default function ChatScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;
  const msgs = d.chat || [];

  const [shown, setShown] = useState(reduce ? msgs.length : 0);
  const [typing, setTyping] = useState(false);
  const timers = useRef([]);
  const threadRef = useRef(null);

  useEffect(() => {
    if (reduce) return;
    let t = 700;
    msgs.forEach((_, i) => {
      // mostra "digitando…"
      timers.current.push(setTimeout(() => setTyping(true), t));
      t += 1100;
      // entrega a mensagem
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, t)
      );
      t += 650;
    });
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  // rola para a última mensagem
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown, typing]);

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
                <span className="chat__time">{m.time}</span>
              </motion.div>
            ))}

            {typing && (
              <div className="chat__msg chat__msg--her chat__msg--typing">
                <span className="chat__dots" aria-hidden="true">
                  <i /><i /><i />
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <ExpStory d={d} rise={rise} base={0.5} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
