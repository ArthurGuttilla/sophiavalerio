import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRise, ExpBack, ExpFoot } from "../components/expParts.jsx";

// Fases: box (chacoalhar) -> grow (buquê cresce) -> count (6 toques) ->
//        ask (Sim / Não fujão) -> yes (casal + texto)
export default function SecretScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState("box");
  const [shake, setShake] = useState(0); // progresso para abrir (0..1)
  const [taps, setTaps] = useState(0); // toques no buquê
  const [noPos, setNoPos] = useState({ x: 58, y: 0 }); // posição do "Não" (%)
  const motionOn = useRef(false);
  const lastMag = useRef(null);

  const SHAKE_TARGET = 6;

  // Detecção de chacoalhada (acelerômetro).
  useEffect(() => {
    function onMotion(e) {
      const a = e.accelerationIncludingGravity || e.acceleration;
      if (!a) return;
      const mag = (a.x || 0) + (a.y || 0) + (a.z || 0);
      if (lastMag.current !== null) {
        const delta = Math.abs(mag - lastMag.current);
        if (delta > 14) bump();
      }
      lastMag.current = mag;
    }
    window.__svMotion = onMotion;
    return () => {
      if (motionOn.current) window.removeEventListener("devicemotion", onMotion);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function bump() {
    setShake((s) => {
      const next = Math.min(SHAKE_TARGET, s + 1);
      if (next >= SHAKE_TARGET) setPhase((p) => (p === "box" ? "grow" : p));
      return next;
    });
  }

  // Fallback: garante a transição buquê -> toques mesmo que o
  // onAnimationComplete não dispare.
  useEffect(() => {
    if (phase !== "grow") return;
    const t = setTimeout(() => setPhase((p) => (p === "grow" ? "count" : p)), reduce ? 400 : 1500);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  // Pedido de permissão (iOS) + começa a ouvir o acelerômetro; também conta
  // como uma "chacoalhada" (fallback para desktop/sem sensor: tocar a caixa).
  async function handleBoxTap() {
    if (!motionOn.current) {
      try {
        const DME = window.DeviceMotionEvent;
        if (DME && typeof DME.requestPermission === "function") {
          const res = await DME.requestPermission();
          if (res === "granted" && window.__svMotion) {
            window.addEventListener("devicemotion", window.__svMotion);
            motionOn.current = true;
          }
        } else if (window.__svMotion) {
          window.addEventListener("devicemotion", window.__svMotion);
          motionOn.current = true;
        }
      } catch {
        /* sem sensor: segue no fallback de toque */
      }
    }
    bump();
  }

  function tapBouquet() {
    setTaps((t) => {
      const next = t + 1;
      if (next >= 6) setPhase("ask");
      return next;
    });
  }

  // "Não" foge ao se aproximar (mouse) ou ao tentar tocar.
  function fleeNo(e) {
    if (e && e.preventDefault) e.preventDefault();
    const x = 6 + Math.random() * 72;
    const y = Math.random() * 70;
    setNoPos({ x, y });
  }

  return (
    <motion.main
      className="exp exp--secret"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ExpBack onClick={onBack} />
      <article className="exp__inner secret">
        <motion.p className="secret__intro" {...rise(0.1)}>{d.intro}</motion.p>

        {/* Caixa misteriosa */}
        {phase === "box" && (
          <motion.div className="secret__stage" {...rise(0.3)}>
            <motion.button
              className="secret__box"
              onClick={handleBoxTap}
              aria-label="abrir a caixa"
              animate={reduce ? {} : { rotate: [-3, 3, -3] }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              🎁
            </motion.button>
            <p className="secret__hint">Chacoalhe o celular para abrir.</p>
            <div className="secret__bar" aria-hidden="true">
              <span style={{ width: `${(shake / SHAKE_TARGET) * 100}%` }} />
            </div>
          </motion.div>
        )}

        {/* Buquê crescendo */}
        {phase === "grow" && (
          <div className="secret__stage">
            <motion.span
              className="secret__bouquet"
              initial={{ scale: reduce ? 1 : 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: reduce ? 0.3 : 1.4, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => setPhase("count")}
            >
              💐
            </motion.span>
          </div>
        )}

        {/* 6 toques no buquê */}
        {phase === "count" && (
          <div className="secret__stage">
            <motion.button
              className="secret__bouquet secret__bouquet--btn"
              onClick={tapBouquet}
              aria-label="tocar no buquê"
              key={taps}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.18 }}
            >
              💐
            </motion.button>
            <p className="secret__hint">Toque no buquê… {6 - taps}x</p>
          </div>
        )}

        {/* Pergunta com Sim / Não fujão */}
        {phase === "ask" && (
          <motion.div
            className="secret__ask"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="secret__question">Quer namorar comigo?</p>
            <div className="secret__buttons">
              <button className="btn secret__yes" onClick={() => setPhase("yes")}>
                Sim
              </button>
              <button
                className="btn btn--ghost secret__no"
                style={{ left: `${noPos.x}%`, top: `${noPos.y}%` }}
                onMouseEnter={fleeNo}
                onPointerDown={fleeNo}
                onClick={fleeNo}
              >
                Não
              </button>
            </div>
          </motion.div>
        )}

        {/* Resposta */}
        {phase === "yes" && (
          <motion.div
            className="secret__yesbox"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="secret__couple"
              initial={{ scale: reduce ? 1 : 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              💑
            </motion.span>
            <div className="secret__finale">
              {(d.finale || []).map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.5 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
            <ExpFoot rise={rise} delay={0.4 + (d.finale || []).length * 0.5} onBack={onBack} />
          </motion.div>
        )}
      </article>
    </motion.main>
  );
}
