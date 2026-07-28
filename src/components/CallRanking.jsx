import { motion } from "framer-motion";
import { callRanking, callTotals } from "../data/calls.js";

// Ranking das 5 ligações mais longas, exibido abaixo da timeline.
export default function CallRanking() {
  return (
    <motion.section
      className="ranking"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="ranking__total">
        <span className="ranking__total-label">tempo em ligação</span>
        <span className="ranking__total-value">{callTotals.value}</span>
        <span className="ranking__total-sub">📞 {callTotals.period}</span>
      </div>

      <h2 className="ranking__title">As 5 ligações mais longas</h2>
      <ol className="ranking__list">
        {callRanking.map((c) => (
          <li key={c.rank} className={`ranking__row ranking__row--${c.rank}`}>
            <span className="ranking__pos">{c.rank}</span>
            <span className="ranking__info">
              <span className="ranking__date">{c.date}</span>
              <span className="ranking__media">chamada de {c.media}</span>
            </span>
            <span className="ranking__dur">{c.dur}</span>
          </li>
        ))}
      </ol>
    </motion.section>
  );
}
