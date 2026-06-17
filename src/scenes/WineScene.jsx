import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Dia 18/05 — o gosto em comum por vinho seco: duas taças que se aproximam
// e tilintam.
export default function WineScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

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

        <motion.div className="wine" {...rise(0.3)} aria-hidden="true">
          <motion.span
            className="wine__glass"
            animate={reduce ? {} : { x: [-22, -2, -22], rotate: [-10, 0, -10] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            🍷
          </motion.span>
          <motion.span
            className="wine__spark"
            animate={reduce ? { opacity: 0.6 } : { opacity: [0, 0, 1, 0], scale: [0.6, 0.6, 1.3, 0.6] }}
            transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.4, 0.5, 0.7], ease: "easeOut" }}
          >
            ✨
          </motion.span>
          <motion.span
            className="wine__glass"
            animate={reduce ? {} : { x: [22, 2, 22], rotate: [10, 0, 10] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            🍷
          </motion.span>
        </motion.div>

        <ExpStory d={d} rise={rise} base={0.5} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
