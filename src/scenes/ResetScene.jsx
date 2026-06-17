import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Dia 12/06 — a surpresa: o countdown resetando antes da hora.
export default function ResetScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? 0 : 9);
  const [done, setDone] = useState(reduce);

  useEffect(() => {
    if (reduce) return;
    let v = 9;
    const id = setInterval(() => {
      v -= 1;
      if (v <= 0) {
        v = 0;
        clearInterval(id);
        setN(0);
        setDone(true);
      } else {
        setN(v);
      }
    }, 260);
    return () => clearInterval(id);
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

        <motion.div className="reset" {...rise(0.3)}>
          <span className="reset__label">contagem para te ver</span>
          <motion.span
            key={n}
            className="reset__num"
            initial={{ scale: reduce ? 1 : 0.7, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {done ? "0" : n}
          </motion.span>
          <motion.span
            className="reset__msg"
            initial={false}
            animate={{ opacity: done ? 1 : 0, y: done ? 0 : 6 }}
            transition={{ duration: 0.5 }}
          >
            countdown resetado, antes da hora 🤍
          </motion.span>
        </motion.div>

        <ExpStory d={d} rise={rise} base={0.5} />
        <ExpFoot rise={rise} delay={0.9} onBack={onBack} />
      </article>
    </motion.main>
  );
}
