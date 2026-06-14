import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Motif from "./Motif.jsx";
import { dates } from "../data/dates.js";
import { secretDate } from "../data/secret.js";
import { getSeen, isUnlocked, allSeen, markAllSeen } from "../progress.js";
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
        <h1 className="gate__title">Para a Sophia</h1>
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
      </motion.form>
    </motion.main>
  );
}

function Calendar() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  // `tick` força re-render quando o easter egg libera tudo.
  const [, setTick] = useState(0);
  const seen = getSeen();
  const secretUnlocked = allSeen(seen);

  // Clicar em "dias" no título libera todas as datas de uma vez.
  function unlockAll() {
    markAllSeen();
    setTick((t) => t + 1);
  }

  // ── Timeline horizontal: rolagem por botões, roda do mouse e arraste.
  const trackRef = useRef(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const SCROLL_KEY = "sv_timeline_scroll";

  // Restaura a posição da timeline ao voltar; salva continuamente.
  // A restauração só vale depois que o layout dos cards estabiliza — por isso
  // tentamos em vários frames até o scrollLeft "fixar" no valor salvo.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const saved = parseFloat(sessionStorage.getItem(SCROLL_KEY) || "0");
    let restoring = saved > 0;
    let frames = 0;
    let raf;

    function restore() {
      if (!restoring) return;
      // Clampa ao máximo atual; se o conteúdo ainda não cresceu, tenta de novo.
      const max = el.scrollWidth - el.clientWidth;
      el.scrollLeft = Math.min(saved, max);
      frames++;
      // Para quando alcançar a posição (ou após ~30 frames de tentativa).
      if (Math.abs(el.scrollLeft - saved) <= 1 || frames > 30) {
        restoring = false;
        return;
      }
      raf = requestAnimationFrame(restore);
    }
    raf = requestAnimationFrame(restore);

    const onScroll = () => {
      // Não salva enquanto ainda estamos restaurando (evita corrida).
      if (restoring) return;
      sessionStorage.setItem(SCROLL_KEY, String(el.scrollLeft));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  function scrollByCards(dir) {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(280, el.clientWidth * 0.8);
    el.scrollBy({ left: dir * amount, behavior: reduce ? "auto" : "smooth" });
  }

  function onWheel(e) {
    const el = trackRef.current;
    if (!el) return;
    // Converte rolagem vertical em horizontal (mouse comum).
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
    }
  }

  function onPointerDown(e) {
    const el = trackRef.current;
    if (!el) return;
    // NÃO captura o ponteiro aqui — senão o clique não chega ao cartão.
    drag.current = {
      down: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      captured: false,
      pointerId: e.pointerId,
    };
  }
  function onPointerMove(e) {
    const el = trackRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 6) {
      // Só agora, ao confirmar um arraste de verdade, captura o ponteiro.
      if (!drag.current.captured) {
        el.setPointerCapture?.(e.pointerId);
        drag.current.captured = true;
      }
      drag.current.moved = true;
      el.scrollLeft = drag.current.startScroll - dx;
    }
  }
  function onPointerUp(e) {
    const el = trackRef.current;
    if (drag.current.captured) el?.releasePointerCapture?.(e.pointerId);
    drag.current.down = false;
    drag.current.captured = false;
  }
  // Evita que o "arrastar" dispare o clique de abrir a data.
  function guardClick(fn) {
    return () => {
      if (drag.current.moved) return;
      fn();
    };
  }

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
          Diário do coração
        </motion.p>
        <motion.h1
          className="home__title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          A construção nos{" "}
          <span
            className="home__unlock"
            role="button"
            tabIndex={0}
            onClick={unlockAll}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                unlockAll();
              }
            }}
            title="liberar todas"
          >
            detalhes
          </span>
        </motion.h1>
        <motion.p
          className="home__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Deslize pela linha do tempo nas datas da nossa história
        </motion.p>
      </header>

      <div className="timeline">
        <button
          className="timeline__nav timeline__nav--prev"
          onClick={() => scrollByCards(-1)}
          aria-label="datas anteriores"
        >
          ‹
        </button>

        <motion.ul
          className="cal"
          ref={trackRef}
          variants={container}
          initial="hidden"
          animate="show"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {dates.map((d, i) => {
            const unlocked = isUnlocked(i, seen);
            return (
              <motion.li key={d.id} variants={card} className="cal__item">
                <span className="cal__node" aria-hidden="true" />
                <button
                  className={`datecard ${unlocked ? "" : "is-locked"}`}
                  onClick={guardClick(() => unlocked && navigate(`/data/${d.id}`))}
                  disabled={!unlocked}
                  aria-disabled={!unlocked}
                  aria-label={
                    unlocked
                      ? `${d.dateLabel}, ${d.title}`
                      : `Bloqueado, veja a data anterior para liberar`
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
            <span className="cal__node cal__node--secret" aria-hidden="true" />
            {secretUnlocked ? (
              <button
                className="datecard datecard--secret"
                onClick={guardClick(() => navigate(`/data/${secretDate.id}`))}
                aria-label={`Surpresa, ${secretDate.title}`}
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

        <button
          className="timeline__nav timeline__nav--next"
          onClick={() => scrollByCards(1)}
          aria-label="próximas datas"
        >
          ›
        </button>
      </div>

      <footer className="home__foot">
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
