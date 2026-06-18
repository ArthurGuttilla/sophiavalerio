import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Candle-lit intimacy: a warm glow, flickering candles, and two soft
// lights that drift together into a single bloom — the first kiss.
function Candle({ delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <div className="candle">
      <div className="candle__stick" />
      <motion.div
        className="candle__flame"
        animate={
          reduce
            ? {}
            : {
                scaleY: [1, 1.12, 0.95, 1.08, 1],
                scaleX: [1, 0.94, 1.05, 0.97, 1],
                opacity: [0.9, 1, 0.85, 1, 0.9],
              }
        }
        transition={{ duration: 1.6, delay, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="candle__halo" />
    </div>
  );
}

export default function KissScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  return (
    <motion.main
      className="exp exp--candle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* warm vignette / glow */}
      <div className="candle-bg" aria-hidden="true" />

      <ExpBack onClick={onBack} />

      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />

        {/* two lights drifting together */}
        <motion.div className="kiss" {...rise(0.3)} aria-hidden="true">
          <motion.span
            className="kiss__orb kiss__orb--a"
            initial={{ x: reduce ? 0 : -60, opacity: 0.7 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          />
          <motion.span
            className="kiss__orb kiss__orb--b"
            initial={{ x: reduce ? 0 : 60, opacity: 0.7 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          />
          <motion.span
            className="kiss__bloom"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: reduce ? 0.5 : [0, 0, 0.9, 0.5], scale: [0.4, 0.4, 1.3, 1] }}
            transition={{ duration: 3, times: [0, 0.6, 0.8, 1], delay: 0.4 }}
          />
          <motion.span
            className="kiss__heart"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: reduce ? 0.4 : 2.4, ease: [0.22, 1, 0.36, 1] }}
          >
            ♥
          </motion.span>
        </motion.div>

        <div className="candle-row" aria-hidden="true">
          <Candle delay={0} />
          <Candle delay={0.5} />
          <Candle delay={0.9} />
        </div>

        <ExpStory d={d} rise={rise} base={0.5} />

        {d.showMap && (
          <motion.figure className="kiss-map" {...rise(0.9)}>
            <iframe
              title="Trajeto a pé do Cora ao Café Longão"
              className="kiss-map__frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={
                "https://www.google.com/maps?output=embed&saddr=" +
                encodeURIComponent("Cora Restaurante, Rua Bento Freitas, São Paulo") +
                "&daddr=" +
                encodeURIComponent("Café Longão, São Paulo") +
                "&dirflg=w"
              }
            />
          </motion.figure>
        )}

        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
