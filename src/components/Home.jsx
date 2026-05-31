import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Motif from "./Motif.jsx";
import { dates } from "../data/dates.js";
import { PASSWORD_HASH, hashPassword } from "../config.js";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const SESSION_KEY = "sv_unlocked";

function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (hashPassword(value) === PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <motion.main
      className="stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Motif variant="hearts" />
      <motion.form
        className="gate"
        onSubmit={submit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="gate__kicker">Para a Sophia</p>
        <h1 className="gate__title">Um lugar só nosso</h1>
        <p className="gate__hint">Digite a senha para entrar.</p>
        <input
          type="password"
          className={`gate__input ${error ? "is-error" : ""}`}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="senha"
          autoFocus
          aria-label="senha"
        />
        {error && <p className="gate__error">Não é essa. Tenta de novo 🤍</p>}
        <button type="submit" className="btn">Entrar</button>
        <Link to="/" className="gate__back">voltar</Link>
      </motion.form>
    </motion.main>
  );
}

function Calendar() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: 0.15 } },
  };
  const card = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.main
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Motif variant="sparkle" />

      <header className="home__head">
        <motion.p
          className="home__kicker"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Datas especiais
        </motion.p>
        <motion.h1
          className="home__title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          A nossa história em dias
        </motion.h1>
        <motion.p
          className="home__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Cada data guarda uma lembrança. Toque para reviver.
        </motion.p>
      </header>

      <motion.ul
        className="cal"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {dates.map((d) => (
          <motion.li key={d.id} variants={card} className="cal__item">
            <button
              className="datecard"
              onClick={() => navigate(`/data/${d.id}`)}
              aria-label={`${d.dateLabel} — ${d.title}`}
            >
              <span className="datecard__chip">
                <span className="datecard__day">{String(d.day).padStart(2, "0")}</span>
                <span className="datecard__mon">{MONTHS[d.month - 1]}</span>
              </span>
              <span className="datecard__body">
                <span className="datecard__kicker">{d.kicker}</span>
                <span className="datecard__title">{d.title}</span>
                <span className="datecard__summary">{d.summary}</span>
              </span>
              <span className="datecard__arrow" aria-hidden="true">→</span>
            </button>
          </motion.li>
        ))}
      </motion.ul>

      <footer className="home__foot">
        <Link to="/" className="btn btn--ghost">voltar ao início</Link>
        <p className="signoff">feito com amor por Arthur&nbsp;🤍</p>
      </footer>
    </motion.main>
  );
}

export default function Home() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );
  return unlocked ? <Calendar /> : <PasswordGate onUnlock={() => setUnlocked(true)} />;
}
