import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot, ExpPhoto,
} from "../components/expParts.jsx";

// Underwater: rising bubbles, drifting light rays, and a few sea creatures
// (jellyfish, fish, a slow ray) floating across. Canvas-driven, gentle.
function Aquarium() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, w, h, dpr, running = true, last = performance.now();
    let bubbles = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(60, Math.round((w * h) / 16000));
      bubbles = Array.from({ length: count }, () => spawn());
    }
    function spawn() {
      return {
        x: Math.random() * w,
        y: h + Math.random() * h,
        r: 1.5 + Math.random() * 5,
        sp: 12 + Math.random() * 30, // px/s upward
        sway: 6 + Math.random() * 14,
        ph: Math.random() * Math.PI * 2,
        a: 0.06 + Math.random() * 0.16,
      };
    }
    resize();
    window.addEventListener("resize", resize);

    function frame(now) {
      const dt = Math.min(60, now - last) / 1000;
      last = now;
      if (!running) { raf = requestAnimationFrame(frame); return; }
      ctx.clearRect(0, 0, w, h);
      for (const b of bubbles) {
        b.y -= b.sp * dt;
        b.ph += dt;
        const x = b.x + Math.sin(b.ph) * b.sway;
        if (b.y + b.r < 0) Object.assign(b, spawn(), { y: h + b.r });
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(246, 242, 234, ${b.a + 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = `rgba(246, 242, 234, ${b.a * 0.5})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    const onVis = () => { running = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="ocean-canvas" aria-hidden="true" />;
}

// Floating emoji creatures drifting horizontally with a gentle bob.
const CREATURES = [
  { e: "🪼", top: "18%", dur: 26, delay: 0, dir: 1, size: "2.4rem" },
  { e: "🐠", top: "42%", dur: 20, delay: 3, dir: -1, size: "2rem" },
  { e: "🐟", top: "62%", dur: 24, delay: 1.5, dir: 1, size: "1.8rem" },
  { e: "🐙", top: "78%", dur: 30, delay: 5, dir: -1, size: "2.2rem" },
  { e: "🪼", top: "52%", dur: 28, delay: 7, dir: 1, size: "1.7rem" },
];

export default function OceanScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  return (
    <motion.main
      className="exp exp--ocean"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="ocean-bg" aria-hidden="true" />
      {!reduce && <Aquarium />}
      {!reduce && (
        <div className="ocean-creatures" aria-hidden="true">
          {CREATURES.map((c, idx) => (
            <motion.span
              key={idx}
              className="ocean-creature"
              style={{ top: c.top, fontSize: c.size }}
              initial={{ x: c.dir > 0 ? "-12vw" : "112vw" }}
              animate={{
                x: c.dir > 0 ? "112vw" : "-12vw",
                y: [0, -10, 6, 0],
              }}
              transition={{
                x: { duration: c.dur, delay: c.delay, repeat: Infinity, ease: "linear" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {c.e}
            </motion.span>
          ))}
        </div>
      )}

      <ExpBack onClick={onBack} />

      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />
        <ExpStory d={d} rise={rise} />

        <ExpPhoto d={d} rise={rise} delay={0.5} />

        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
