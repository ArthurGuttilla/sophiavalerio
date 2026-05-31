import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpFoot,
} from "../components/expParts.jsx";

// "Convites em agenda" — cria um convite recorrente no Google Calendar
// para todo dia 16 de cada mês: "Sophia e Arthur ❤️".
const EVENT_TITLE = "Sophia e Arthur ❤️";
const EVENT_DETAILS = "Todo dia 16 é nosso. Um lembrete mensal de nós. 🤍";

// Primeira ocorrência: 16/05/2026, das 20:00 às 21:00 (horário local).
const FIRST = { y: 2026, m: 5, d: 16, startH: 20, endH: 21 };

function pad(n) {
  return String(n).padStart(2, "0");
}

// Formato de data "flutuante" (sem fuso) usado pelo Google e pelo ICS:
// YYYYMMDDTHHMMSS
function floatStamp(y, m, d, h, min = 0) {
  return `${y}${pad(m)}${pad(d)}T${pad(h)}${pad(min)}00`;
}

function googleCalUrl() {
  const start = floatStamp(FIRST.y, FIRST.m, FIRST.d, FIRST.startH);
  const end = floatStamp(FIRST.y, FIRST.m, FIRST.d, FIRST.endH);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    details: EVENT_DETAILS,
    dates: `${start}/${end}`,
    recur: "RRULE:FREQ=MONTHLY;BYMONTHDAY=16",
    ctz: "America/Sao_Paulo",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function AgendaScene({ d, onBack }) {
  const rise = useRise();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  const gcal = useMemo(googleCalUrl, []);

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
        <ExpStory d={d} rise={rise} />

        {/* Cartão de convite */}
        <motion.div className="agenda" {...rise(0.3 + d.story.length * 0.12)}>
          <div className="agenda__card">
            <span className="agenda__month">todo dia 16</span>
            <span className="agenda__num">16</span>
            <span className="agenda__title">{EVENT_TITLE}</span>
            <span className="agenda__sub">um lembrete mensal de nós</span>
          </div>

          <div className="agenda__actions">
            <a
              className="btn"
              href={gcal}
              target="_blank"
              rel="noopener noreferrer"
            >
              ＋ Adicionar ao Google Agenda
            </a>
          </div>
          <p className="agenda__hint">
            O convite repete todo mês, no dia 16, às 20h.
          </p>
        </motion.div>

        <ExpQuote d={d} rise={rise} delay={quoteDelay} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
