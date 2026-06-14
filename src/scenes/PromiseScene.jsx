import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpFoot,
} from "../components/expParts.jsx";

// Dia 04/06 — a decisão de "fazer dar certo": conversa que aparece aos
// poucos, um áudio com a minha voz (placeholder até o arquivo existir), as
// quatro caixas de temperamento e os destaques do dia.
export default function PromiseScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const msgs = d.chat || [];
  const temps = d.temperaments || [];

  const [shown, setShown] = useState(reduce ? msgs.length : 0);
  const [typing, setTyping] = useState(false);
  const timers = useRef([]);
  const threadRef = useRef(null);

  useEffect(() => {
    if (reduce) return;
    let t = 700;
    msgs.forEach((_, i) => {
      timers.current.push(setTimeout(() => setTyping(true), t));
      t += 1200;
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, t)
      );
      t += 700;
    });
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown, typing]);

  const audioSrc = d.audio ? `${import.meta.env.BASE_URL}${d.audio}` : null;

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
                <span className="chat__time">{m.time}</span>
              </motion.div>
            ))}
            {typing && (
              <div className="chat__msg chat__msg--her chat__msg--typing">
                <span className="chat__dots" aria-hidden="true"><i /><i /><i /></span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Áudio: minha voz recitando as palavras (ou placeholder) */}
        <motion.div className="voicenote" {...rise(0.45)}>
          {audioSrc ? (
            <audio className="voicenote__player" src={audioSrc} controls preload="metadata" />
          ) : (
            <div className="voicenote__ph">
              <span className="voicenote__icon" aria-hidden="true">🎙️</span>
              <span className="voicenote__text">{d.audioLabel}</span>
            </div>
          )}
        </motion.div>

        {/* História, com os temperamentos logo após o parágrafo que os cita. */}
        <div className="exp__story">
          {(d.story || []).map((p, i) => {
            const isTemperPara = /temperamento/i.test(p);
            return (
              <motion.div key={i} {...rise(0.55 + i * 0.12)}>
                <p>{p}</p>
                {isTemperPara && temps.length > 0 && (
                  <div className="temper">
                    <p className="temper__title">Os quatro temperamentos</p>
                    <div className="temper__grid">
                      {temps.map((t, k) => (
                        <motion.div
                          key={t.key}
                          className={`temper__card temper__card--${t.key}`}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: reduce ? 0 : 0.2 + k * 0.12, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <motion.span
                            className="temper__emoji"
                            animate={reduce ? {} : { y: [0, -5, 0] }}
                            transition={{ duration: 3 + k * 0.4, repeat: Infinity, ease: "easeInOut" }}
                            aria-hidden="true"
                          >
                            {t.emoji}
                          </motion.span>
                          <span className="temper__name">{t.name}</span>
                          <span className="temper__desc">{t.desc}</span>
                        </motion.div>
                      ))}
                    </div>
                    {d.temperamentNote && <p className="temper__note">{d.temperamentNote}</p>}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <ExpFoot rise={rise} delay={0.9} onBack={onBack} />
      </article>
    </motion.main>
  );
}
