import { useParams, useNavigate, Navigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Motif from "./Motif.jsx";
import { getDate } from "../data/dates.js";

function spotifyEmbed(url) {
  // https://open.spotify.com/playlist/ID -> /embed/playlist/ID
  return url.replace("open.spotify.com/", "open.spotify.com/embed/");
}

export default function Experience() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const d = getDate(id);

  if (!d) return <Navigate to="/home" replace />;

  const ease = [0.22, 1, 0.36, 1];
  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <motion.main
      className="exp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Motif variant={d.motif} seed={id.length * 13 + 3} />

      <button className="exp__close" onClick={() => navigate("/home")} aria-label="voltar">
        ← datas
      </button>

      <article className="exp__inner">
        <motion.p className="exp__date" {...rise(0.05)}>{d.dateLabel}</motion.p>
        <motion.p className="exp__kicker" {...rise(0.12)}>{d.kicker}</motion.p>
        <motion.h1 className="exp__title" {...rise(0.18)}>{d.title}</motion.h1>

        <div className="exp__story">
          {d.story.map((p, i) => (
            <motion.p key={i} {...rise(0.3 + i * 0.12)}>{p}</motion.p>
          ))}
        </div>

        {d.quote && (
          <motion.blockquote className="exp__quote" {...rise(0.3 + d.story.length * 0.12 + 0.1)}>
            <span className="exp__quote-mark" aria-hidden="true">“</span>
            {d.quote}
          </motion.blockquote>
        )}

        {d.media && d.media.length > 0 && (
          <motion.div className="exp__media" {...rise(0.3 + d.story.length * 0.12 + 0.25)}>
            {d.media.map((m, i) =>
              m.type === "spotify" ? (
                <div className="exp__spotify" key={i}>
                  <iframe
                    title={m.label}
                    src={spotifyEmbed(m.url)}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  />
                </div>
              ) : (
                <a
                  key={i}
                  className="btn btn--ghost"
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ♪ {m.label}
                </a>
              )
            )}
          </motion.div>
        )}

        <motion.div className="exp__foot" {...rise(0.3 + d.story.length * 0.12 + 0.4)}>
          <button className="btn btn--ghost" onClick={() => navigate("/home")}>
            voltar às datas
          </button>
          <p className="signoff">para você, com amor 🤍</p>
        </motion.div>
      </article>
    </motion.main>
  );
}
