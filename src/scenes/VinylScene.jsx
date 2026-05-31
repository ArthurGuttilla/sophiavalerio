import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpMedia, ExpFoot,
} from "../components/expParts.jsx";

// A spinning vinyl record above the Spotify player — the date we found
// the same taste in music.
export default function VinylScene({ d, onBack }) {
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

        <motion.div className="vinyl" {...rise(0.28)}>
          <motion.div
            className="vinyl__disc"
            animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="vinyl__groove" />
            <div className="vinyl__groove vinyl__groove--2" />
            <div className="vinyl__groove vinyl__groove--3" />
            <div className="vinyl__label">SV</div>
            <div className="vinyl__hole" />
          </motion.div>
        </motion.div>

        <ExpStory d={d} rise={rise} />
        <ExpQuote d={d} rise={rise} delay={quoteDelay} />
        <ExpMedia d={d} rise={rise} delay={quoteDelay + 0.15} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
