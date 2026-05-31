import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

// A barely-there animated backdrop. Each motif drifts gentle glyphs
// across the warm background — fashion, never busy.
const GLYPHS = {
  stars: ["✦", "✧", "·", "✶"],
  notes: ["♪", "♩", "♫", "·"],
  coffee: ["☕", "·", "❛"],
  hearts: ["♡", "·", "❀"],
  sparkle: ["✦", "·", "✧"],
  water: ["◦", "∘", "·", "○"],
  dust: ["·", "∘", "·"],
};

function makeField(count, seed) {
  // Tiny seeded RNG so positions are stable across renders.
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => ({
    left: rnd() * 100,
    top: rnd() * 100,
    size: 0.6 + rnd() * 1.8,
    delay: rnd() * 6,
    dur: 7 + rnd() * 9,
    drift: 14 + rnd() * 26,
    opacity: 0.06 + rnd() * 0.16,
  }));
}

export default function Motif({ variant = "dust", seed = 7 }) {
  const reduce = useReducedMotion();
  const glyphs = GLYPHS[variant] || GLYPHS.dust;
  const count = variant === "dust" ? 18 : 22;
  const field = useMemo(() => makeField(count, seed), [count, seed]);

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="motif">
      {field.map((p, i) => (
        <motion.span
          key={i}
          className="motif__glyph"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}rem`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            y: [0, -p.drift],
            x: [0, (i % 2 ? 1 : -1) * (p.drift / 3)],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {glyphs[i % glyphs.length]}
        </motion.span>
      ))}
    </div>
  );
}
