import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Dia 05/06 — a listinha: um checklist que se marca sozinho, item a item,
// e um disco "Falling in Love" gravado para você.
export default function ChecklistScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const items = d.checklist || [];

  const [checked, setChecked] = useState(reduce ? items.length : 0);
  const timers = useRef([]);

  useEffect(() => {
    if (reduce) return;
    items.forEach((_, i) => {
      timers.current.push(setTimeout(() => setChecked(i + 1), 900 + i * 650));
    });
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const allDone = checked >= items.length;

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
              const on = i < checked;
              return (
                <li key={i} className={`checklist__item ${on ? "is-on" : ""}`}>
                  <span className="checklist__box" aria-hidden="true">
                    <motion.span
                      className="checklist__tick"
                      initial={false}
                      animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      ✓
                    </motion.span>
                  </span>
                  <span className="checklist__label">{item}</span>
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
            Todos os itens. Cada um deles. Você. 🤍
          </motion.p>
        </motion.div>

        <ExpStory d={d} rise={rise} base={0.55} />
        <ExpFoot rise={rise} delay={0.9} onBack={onBack} />
      </article>
    </motion.main>
  );
}
