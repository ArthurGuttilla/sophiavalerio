import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";
import YoutubeAuto from "../components/YoutubeAuto.jsx";

// Dia 05/06 — a listinha: cada item se marca conforme você rola até ele,
// devagar, e também dá para tocar para marcar/desmarcar. Um disco
// "Falling in Love" gravado para você acompanha.
export default function ChecklistScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  // Normaliza: item pode ser string (cumprido) ou { text, met:false } (não).
  const items = (d.checklist || []).map((it) =>
    typeof it === "string" ? { text: it, met: true } : { text: it.text, met: it.met !== false }
  );

  // Conjunto de índices marcados (apenas itens cumpridos entram).
  const [checked, setChecked] = useState(() =>
    reduce ? new Set(items.map((it, i) => (it.met ? i : -1)).filter((i) => i >= 0)) : new Set()
  );
  const itemRefs = useRef([]);
  const timers = useRef([]);

  // Marca cada item cumprido ao entrar na viewport (acompanhando o scroll).
  useEffect(() => {
    if (reduce || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            const t = setTimeout(() => {
              setChecked((prev) => {
                if (prev.has(idx)) return prev;
                const next = new Set(prev);
                next.add(idx);
                return next;
              });
            }, 450);
            timers.current.push(t);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.85, rootMargin: "0px 0px -10% 0px" }
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => {
      io.disconnect();
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  function toggle(i) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  // "Pronto" quando todos os itens cumpridos foram marcados.
  const allDone = items.every((it, i) => !it.met || checked.has(i));

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

        {d.bgYoutube && (
          <YoutubeAuto videoId={d.bgYoutube} start={d.bgYoutubeStart || 0} label={d.bgYoutubeLabel} />
        )}

        {/* Disco gravado */}
        {d.record && (
          <motion.div className="record" {...rise(0.28)}>
            <motion.div
              className="record__disc"
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            >
              <div className="record__label">♪</div>
              <div className="record__hole" />
            </motion.div>
            <div className="record__meta">
              <span className="record__title">{d.record.title}</span>
              <span className="record__sub">{d.record.subtitle}</span>
            </div>
          </motion.div>
        )}

        {/* Checklist */}
        <motion.div className="checklist" {...rise(0.4)}>
          <p className="checklist__title">{d.checklistTitle}</p>
          <ul className="checklist__list">
            {items.map((item, i) => {
              // Item não cumprido: X vermelho fixo, sem interação.
              if (!item.met) {
                return (
                  <li key={i} className="checklist__item is-unmet">
                    <div className="checklist__btn checklist__btn--static">
                      <span className="checklist__box" aria-hidden="true">
                        <span className="checklist__cross">✕</span>
                      </span>
                      <span className="checklist__label">{item.text}</span>
                    </div>
                  </li>
                );
              }
              const on = checked.has(i);
              return (
                <li
                  key={i}
                  data-idx={i}
                  ref={(el) => (itemRefs.current[i] = el)}
                  className={`checklist__item ${on ? "is-on" : ""}`}
                >
                  <button
                    type="button"
                    className="checklist__btn"
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    aria-label={item.text}
                  >
                    <span className="checklist__box" aria-hidden="true">
                      <motion.span
                        className="checklist__tick"
                        initial={false}
                        animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        ✓
                      </motion.span>
                    </span>
                    <span className="checklist__label">{item.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <motion.p
            className="checklist__done"
            initial={false}
            animate={{ opacity: allDone ? 1 : 0, y: allDone ? 0 : 6 }}
            transition={{ duration: 0.5 }}
          >
            Quase tudo. O que faltou a gente nem considera. Você é do jeitinho que eu pensei. 🤍
          </motion.p>
        </motion.div>

        <ExpStory d={d} rise={rise} base={0.55} />
        <ExpFoot rise={rise} delay={0.9} onBack={onBack} />
      </article>
    </motion.main>
  );
}
