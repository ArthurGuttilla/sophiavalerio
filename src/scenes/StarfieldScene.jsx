import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpMedia, ExpFoot,
} from "../components/expParts.jsx";
import YoutubeAuto from "../components/YoutubeAuto.jsx";

// Deep-espresso night sky: twinkling stars with subtle pointer parallax
// and the occasional shooting star. Used for Interstellar & astrology.
function Sky() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, w, h, dpr;
    let stars = [];
    let shooting = null;
    let nextShoot = 2500 + Math.random() * 3000;
    let last = performance.now();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let running = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.round((w * h) / 4200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.3 + Math.random() * 1.7, // depth -> parallax + size
        r: 0.4 + Math.random() * 1.4,
        tw: Math.random() * Math.PI * 2, // twinkle phase
        sp: 0.6 + Math.random() * 1.6,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    function onMove(e) {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      pointer.tx = (cx / window.innerWidth - 0.5) * 2;
      pointer.ty = (cy / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("pointermove", onMove);

    function frame(now) {
      const dt = Math.min(50, now - last);
      last = now;
      if (!running) { raf = requestAnimationFrame(frame); return; }

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.tw += (dt / 1000) * s.sp;
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.tw));
        const px = s.x + pointer.x * s.z * 10;
        const py = s.y + pointer.y * s.z * 10;
        ctx.beginPath();
        ctx.arc(px, py, s.r * s.z * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 242, 234, ${a * 0.9})`;
        ctx.fill();
      }

      // Shooting star
      nextShoot -= dt;
      if (!shooting && nextShoot <= 0) {
        const fromLeft = Math.random() > 0.5;
        shooting = {
          x: fromLeft ? -40 : w + 40,
          y: Math.random() * h * 0.5,
          vx: (fromLeft ? 1 : -1) * (0.5 + Math.random() * 0.4) * w * 0.001 * 16,
          vy: (0.25 + Math.random() * 0.25) * h * 0.001 * 16,
          life: 0,
          max: 700,
        };
        nextShoot = 4000 + Math.random() * 5000;
      }
      if (shooting) {
        shooting.life += dt;
        shooting.x += shooting.vx * (dt / 16);
        shooting.y += shooting.vy * (dt / 16);
        const t = shooting.life / shooting.max;
        const tailX = shooting.x - shooting.vx * 6;
        const tailY = shooting.y - shooting.vy * 6;
        const grad = ctx.createLinearGradient(shooting.x, shooting.y, tailX, tailY);
        const alpha = Math.sin(Math.min(1, t) * Math.PI);
        grad.addColorStop(0, `rgba(246,242,234,${alpha})`);
        grad.addColorStop(1, "rgba(246,242,234,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(shooting.x, shooting.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        if (t >= 1) shooting = null;
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const onVis = () => { running = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="sky" aria-hidden="true" />;
}

export default function StarfieldScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  return (
    <motion.main
      className="exp exp--night"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!reduce && <Sky />}
      <ExpBack onClick={onBack} />
      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />
        <ExpStory d={d} rise={rise} />
        {d.bgYoutube && (
          <YoutubeAuto videoId={d.bgYoutube} start={d.bgYoutubeStart || 0} label={d.bgYoutubeLabel} />
        )}
        <ExpQuote d={d} rise={rise} delay={quoteDelay} />
        <ExpMedia d={d} rise={rise} delay={quoteDelay + 0.15} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
