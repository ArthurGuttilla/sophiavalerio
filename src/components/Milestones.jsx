import { motion } from "framer-motion";
import { formatSince } from "../dateUtils.js";

// Marcos: tempo (anos, meses e dias) desde cada data-base até hoje.
const BASES = [
  { verb: "conversando", y: 2026, m: 3, d: 6, label: "06 de abril de 2026" },   // 06/04
  { verb: "se encontrando", y: 2026, m: 4, d: 6, label: "06 de maio de 2026" }, // 06/05
  { verb: "namorando", y: 2026, m: 5, d: 20, label: "20 de junho de 2026" },    // 20/06
];

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
            {formatSince(b.y, b.m, b.d)}
          </span>{" "}
          {b.verb}
        </p>
      ))}
    </motion.section>
  );
}
