import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Motif from "../components/Motif.jsx";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpMedia, ExpVideo, ExpFoot,
} from "../components/expParts.jsx";

// Dia 11/06 — uma bola de futebol interativa: arraste para lançar ou toque
// para chutar; ela quica pelo gramado com gravidade e atrito.
function Ball() {
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const ballRef = useRef(null);

  useEffect(() => {
    if (reduce) return;
    const stage = stageRef.current;
    const ball = ballRef.current;
    if (!stage || !ball) return;

    const SIZE = ball.offsetWidth || 56;
    const GRAV = 2200; // px/s²
    const REST = 0.72; // restituição (quique)
    const FRICT = 0.985; // atrito do ar
    const FLOOR_FRICT = 0.82; // atrito ao rolar no chão

    const st = {
      x: (stage.clientWidth - SIZE) / 2,
      y: stage.clientHeight * 0.25,
      vx: 0,
      vy: 0,
    };

    const drag = { on: false, lastX: 0, lastY: 0, lastT: 0, moved: false, id: null };
    let raf;
    let last = performance.now();

    function bounds() {
      return { w: stage.clientWidth - SIZE, h: stage.clientHeight - SIZE };
    }
    function paint() {
      ball.style.transform = `translate(${st.x}px, ${st.y}px) rotate(${st.x * 1.4}deg)`;
    }
    paint();

    function step(now) {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const { w, h } = bounds();

      if (!drag.on) {
        st.vy += GRAV * dt;
        st.x += st.vx * dt;
        st.y += st.vy * dt;
        st.vx *= FRICT;

        if (st.x < 0) { st.x = 0; st.vx = -st.vx * REST; }
        else if (st.x > w) { st.x = w; st.vx = -st.vx * REST; }

        if (st.y > h) {
          st.y = h;
          st.vy = -st.vy * REST;
          st.vx *= FLOOR_FRICT;
          if (Math.abs(st.vy) < 40) st.vy = 0; // assenta no chão
        } else if (st.y < 0) {
          st.y = 0;
          st.vy = -st.vy * REST;
        }
        paint();
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    function localPoint(e) {
      const r = stage.getBoundingClientRect();
      return { x: e.clientX - r.left - SIZE / 2, y: e.clientY - r.top - SIZE / 2 };
    }

    function onDown(e) {
      drag.on = true;
      drag.moved = false;
      drag.id = e.pointerId;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.lastT = performance.now();
      ball.setPointerCapture?.(e.pointerId);
      st.vx = 0;
      st.vy = 0;
    }
    function onMove(e) {
      if (!drag.on) return;
      const p = localPoint(e);
      const { w, h } = bounds();
      st.x = Math.max(0, Math.min(w, p.x));
      st.y = Math.max(0, Math.min(h, p.y));
      const t = performance.now();
      const dt = Math.max(0.001, (t - drag.lastT) / 1000);
      if (Math.abs(e.clientX - drag.lastX) + Math.abs(e.clientY - drag.lastY) > 3) {
        drag.moved = true;
      }
      st.vx = (e.clientX - drag.lastX) / dt;
      st.vy = (e.clientY - drag.lastY) / dt;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.lastT = t;
      paint();
    }
    function onUp(e) {
      if (!drag.on) return;
      drag.on = false;
      ball.releasePointerCapture?.(e.pointerId);
      // Toque sem arraste = chute para cima.
      if (!drag.moved) {
        st.vy = -1100;
        st.vx = (Math.random() - 0.5) * 700;
      } else {
        // Limita a velocidade de lançamento.
        st.vx = Math.max(-2600, Math.min(2600, st.vx));
        st.vy = Math.max(-2600, Math.min(2600, st.vy));
      }
    }

    ball.addEventListener("pointerdown", onDown);
    ball.addEventListener("pointermove", onMove);
    ball.addEventListener("pointerup", onUp);
    ball.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      ball.removeEventListener("pointerdown", onDown);
      ball.removeEventListener("pointermove", onMove);
      ball.removeEventListener("pointerup", onUp);
      ball.removeEventListener("pointercancel", onUp);
    };
  }, [reduce]);

  return (
    <motion.div
      className="ballstage"
      ref={stageRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="ballstage__line" aria-hidden="true" />
      <span
        className="ballstage__ball"
        ref={ballRef}
        role="button"
        tabIndex={0}
        aria-label="bola de futebol, toque ou arraste"
      >
        ⚽
      </span>
      <span className="ballstage__hint">arraste e solte, ou toque para chutar</span>
    </motion.div>
  );
}

export default function BallScene({ d, onBack }) {
  const rise = useRise();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  return (
    <motion.main
      className="exp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Motif variant={d.motif} seed={d.id.length * 13 + 3} />
      <ExpBack onClick={onBack} />
      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />
        <Ball />
        <ExpStory d={d} rise={rise} base={0.45} />
        <ExpVideo d={d} rise={rise} delay={quoteDelay + 0.05} />
        <ExpQuote d={d} rise={rise} delay={quoteDelay} />
        <ExpMedia d={d} rise={rise} delay={quoteDelay + 0.15} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
