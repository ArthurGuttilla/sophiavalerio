import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpFoot,
} from "../components/expParts.jsx";

// Dia 03/06 — "Decolando, pousei": um cartão de embarque e um aviãozinho
// cruzando o céu.
export default function BoardingScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const bp = d.boardingPass || {};
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

        <motion.div className="boarding" {...rise(0.3)}>
          {!reduce && (
            <motion.span
              className="boarding__plane"
              aria-hidden="true"
              initial={{ x: "-20%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              ✈️
            </motion.span>
          )}

          <div className="boarding__card">
            <div className="boarding__head">
              <span>boarding pass</span>
              <span aria-hidden="true">✈</span>
            </div>
            <div className="boarding__route">
              <span className="boarding__code">{bp.from || "SDU"}</span>
              <span className="boarding__dots" aria-hidden="true">• • • • •</span>
              <span className="boarding__code">{bp.to || "VOCÊ"}</span>
            </div>
            <div className="boarding__row">
              <span><small>passageiro</small><br />{bp.passenger || "Arthur & Sophia"}</span>
              <span className="boarding__status">
                <em>decolando</em> · <strong>pousei 🤍</strong>
              </span>
            </div>
          </div>
        </motion.div>

        <ExpStory d={d} rise={rise} base={0.5} />
        <ExpQuote d={d} rise={rise} delay={quoteDelay} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
