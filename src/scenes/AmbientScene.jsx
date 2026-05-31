import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpFoot,
} from "../components/expParts.jsx";

// Cena ambiente reutilizável: um fundo temático com emojis/ícones flutuando
// suavemente e uma "vitrine" central. Configurada por `preset`.
const PRESETS = {
  market: {
    cls: "amb--market",
    floats: ["🥬", "🍅", "🥕", "🌿", "🫑", "🥦", "🍋", "🌽"],
    centerpiece: ["🧺", "Feira da manhã"],
    caption: "do orgânico ao caseiro — comida feita com cuidado",
  },
  coffee: {
    cls: "amb--coffee",
    floats: ["☕", "🤎", "✺", "❛", "☕", "✦"],
    centerpiece: ["☕", "Café recém-passado"],
    caption: "grãos torrados, conversa devagar, o aconchego do ritual",
  },
  italian: {
    cls: "amb--italian",
    floats: ["🍕", "🕯️", "🍷", "🌙", "✦", "🍅"],
    centerpiece: ["🍕", "Cantina à luz de velas"],
    caption: "pizza, vinho e o brilho quente das velas",
  },
};

function makeField(count, seed) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => ({
    left: rnd() * 100,
    top: rnd() * 100,
    size: 1.1 + rnd() * 1.8,
    delay: rnd() * 6,
    dur: 8 + rnd() * 8,
    drift: 16 + rnd() * 26,
  }));
}

export default function AmbientScene({ d, onBack, preset }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const cfg = PRESETS[preset] || PRESETS.coffee;
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;
  const field = useMemo(() => makeField(16, preset.length * 31 + 7), [preset]);

  return (
    <motion.main
      className={`exp ${cfg.cls}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!reduce && (
        <div className="amb__field" aria-hidden="true">
          {field.map((p, i) => (
            <motion.span
              key={i}
              className="amb__float"
              style={{ left: `${p.left}%`, top: `${p.top}%`, fontSize: `${p.size}rem` }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.5, 0.5, 0], y: [0, -p.drift] }}
              transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              {cfg.floats[i % cfg.floats.length]}
            </motion.span>
          ))}
        </div>
      )}

      <ExpBack onClick={onBack} />

      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />

        <motion.figure className="amb__stage" {...rise(0.3)}>
          <motion.span
            className="amb__icon"
            animate={reduce ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            {cfg.centerpiece[0]}
          </motion.span>
          <figcaption className="amb__cap">
            <span className="amb__cap-title">{cfg.centerpiece[1]}</span>
            <span className="amb__cap-sub">{cfg.caption}</span>
          </figcaption>
        </motion.figure>

        <ExpStory d={d} rise={rise} base={0.45} />
        <ExpQuote d={d} rise={rise} delay={quoteDelay} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
