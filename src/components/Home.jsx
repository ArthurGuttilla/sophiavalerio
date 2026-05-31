import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Motif from "./Motif.jsx";
import { dates } from "../data/dates.js";
import { secretDate } from "../data/secret.js";
import { getSeen, isUnlocked, allSeen } from "../progress.js";
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

  // Lido uma vez na montagem — markSeen acontece na página da experiência.
  const seen = getSeen();
  const secretUnlocked = allSeen(seen);

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
          Cada data abre a próxima. Toque para reviver.
        </motion.p>
      </header>

      <motion.ul
        className="cal"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {dates.map((d, i) => {
          const unlocked = isUnlocked(i, seen);
          return (
            <motion.li key={d.id} variants={card} className="cal__item">
              <button
                className={`datecard ${unlocked ? "" : "is-locked"}`}
                onClick={() => unlocked && navigate(`/data/${d.id}`)}
                disabled={!unlocked}
                aria-disabled={!unlocked}
                aria-label={
                  unlocked
                    ? `${d.dateLabel} — ${d.title}`
                    : `Bloqueado — veja a data anterior para liberar`
                }
              >
                <span className="datecard__chip">
                  <span className="datecard__day">{String(d.day).padStart(2, "0")}</span>
                  <span className="datecard__mon">{MONTHS[d.month - 1]}</span>
                </span>
                <span className="datecard__body">
                  <span className="datecard__kicker">{d.kicker}</span>
                  <span className="datecard__title">
                    {unlocked ? d.title : "Ainda trancado"}
                  </span>
                  <span className="datecard__summary">
                    {unlocked ? d.summary : "Veja a data anterior para liberar esta."}
                  </span>
                </span>
                <span className="datecard__arrow" aria-hidden="true">
                  {unlocked ? "→" : "🔒"}
                </span>
              </button>
            </motion.li>
          );
        })}

        {/* Data secreta — só aparece quando tudo foi visto. */}
        <motion.li variants={card} className="cal__item">
          {secretUnlocked ? (
            <button
              className="datecard datecard--secret"
              onClick={() => navigate(`/data/${secretDate.id}`)}
              aria-label={`Surpresa — ${secretDate.title}`}
            >
              <span className="datecard__chip datecard__chip--secret">
                <span className="datecard__day">♥</span>
              </span>
              <span className="datecard__body">
                <span className="datecard__kicker">{secretDate.kicker}</span>
                <span className="datecard__title">{secretDate.title}</span>
                <span className="datecard__summary">{secretDate.summary}</span>
              </span>
              <span className="datecard__arrow" aria-hidden="true">→</span>
            </button>
          ) : (
            <div className="datecard datecard--secret is-locked" aria-hidden="true">
              <span className="datecard__chip datecard__chip--secret">
                <span className="datecard__day">?</span>
              </span>
              <span className="datecard__body">
                <span className="datecard__kicker">Surpresa</span>
                <span className="datecard__title">Uma data secreta</span>
                <span className="datecard__summary">
                  Veja todas as datas para revelar.
                </span>
              </span>
              <span className="datecard__arrow" aria-hidden="true">🔒</span>
            </div>
          )}
        </motion.li>
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
