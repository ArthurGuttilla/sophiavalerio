import { motion } from "framer-motion";

// Marcos: dias desde cada data-base até hoje (recalculado ao abrir a página).
const BASES = [
  { verb: "conversando", y: 2026, m: 3, d: 6, label: "06 de abril de 2026" },   // 06/04
  { verb: "se encontrando", y: 2026, m: 4, d: 6, label: "06 de maio de 2026" }, // 06/05
  { verb: "namorando", y: 2026, m: 5, d: 20, label: "20 de junho de 2026" },    // 20/06
];

function daysSince(y, m, d) {
  return Math.max(0, Math.floor((Date.now() - new Date(y, m, d).getTime()) / 86400000));
}

export default function Milestones() {
  return (
    <motion.section
      className="miles"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {BASES.map((b) => (
        <p className="miles__line" key={b.verb}>
          há{" "}
          <span className="miles__num" title={`desde ${b.label}`}>
            {daysSince(b.y, b.m, b.d)}
          </span>{" "}
          dias {b.verb}
        </p>
      ))}
    </motion.section>
  );
}
