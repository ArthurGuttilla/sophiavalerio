import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Dia 06/06 — o nosso número. Um grande "06" e os marcos do dia 6 surgindo
// um a um, num clima introspectivo.
export default function AnniversaryScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const milestones = d.milestones || [];

  const [shown, setShown] = useState(reduce ? milestones.length : 0);
  const timers = useRef([]);

  useEffect(() => {
    if (reduce) return;
    milestones.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(i + 1), 1100 + i * 1100));
    });
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

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

        <motion.div className="anniv" {...rise(0.3)}>
          <ul className="anniv__list">
            {milestones.map((m, i) => {
              const on = i < shown;
              return (
                <motion.li
                  key={i}
                  className="anniv__item"
                  initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.92 }}
                  animate={{
                    opacity: on ? 1 : 0,
                    y: on ? 0 : 24,
                    scale: on ? 1 : 0.92,
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.span
                    className="anniv__pulse"
                    aria-hidden="true"
                    animate={reduce ? {} : { scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  />
                  <span className="anniv__when">{m.when}</span>
                  <span className="anniv__what">{m.what}</span>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        <ExpStory d={d} rise={rise} base={0.5} />
        <ExpFoot rise={rise} delay={0.9} onBack={onBack} />
      </article>
    </motion.main>
  );
}
