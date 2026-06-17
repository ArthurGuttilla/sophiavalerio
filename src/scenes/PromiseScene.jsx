import { useState } from "react";
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
  const temps = d.temperaments || [];

  const [audioFailed, setAudioFailed] = useState(false);

  const audioSrc = d.audio && !audioFailed ? `${import.meta.env.BASE_URL}${d.audio}` : null;

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

        {/* Conversa: no lugar do texto, a minha voz como mensagem de áudio */}
        <motion.div className="chat" {...rise(0.3)}>
          <div className="chat__bar">
            <span className="chat__avatar" aria-hidden="true">S</span>
            <span className="chat__who">
              <span className="chat__name">Sophia Valerio Feat</span>
              <span className="chat__status">online</span>
            </span>
          </div>
          <div className="chat__thread">
            <div className="chat__msg chat__msg--me chat__msg--audio">
              {audioSrc ? (
                <audio
                  className="chat__audio"
                  src={audioSrc}
                  controls
                  preload="metadata"
                  onError={() => setAudioFailed(true)}
                />
              ) : (
                <span className="chat__voiceph">
                  <span aria-hidden="true">🎙️</span> {d.audioLabel}
                </span>
              )}
            </div>
          </div>
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
