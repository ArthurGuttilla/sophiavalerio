import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpMedia, ExpFoot,
} from "../components/expParts.jsx";
import BgAudio from "../components/BgAudio.jsx";

// A spinning vinyl record above the Spotify player — the date we found
// the same taste in music. A background track (e.g. My Funny Valentine)
// plays softly; clicking into the Spotify player pauses it so the chosen
// playlist takes over.
export default function VinylScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  const [spotifyActive, setSpotifyActive] = useState(false);
  const wrapRef = useRef(null);

  // Clicar dentro do iframe do Spotify move o foco para ele — usamos isso
  // para pausar a trilha de fundo (o iframe é cross-origin, então não dá
  // para ler o estado de reprodução diretamente).
  useEffect(() => {
    function onBlur() {
      const el = document.activeElement;
      if (el && el.tagName === "IFRAME" && wrapRef.current?.contains(el)) {
        setSpotifyActive(true);
      }
    }
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  return (
    <motion.main
      className="exp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ExpBack onClick={onBack} />

      {d.bgAudio && (
        <BgAudio src={d.bgAudio} label={d.bgAudioLabel} pausedExternally={spotifyActive} />
      )}

      <article className="exp__inner" ref={wrapRef}>
        <ExpHeader d={d} rise={rise} />

        <motion.div className="vinyl" {...rise(0.28)}>
          <motion.div
            className="vinyl__disc"
            animate={reduce || spotifyActive ? {} : { rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="vinyl__groove" />
            <div className="vinyl__groove vinyl__groove--2" />
            <div className="vinyl__groove vinyl__groove--3" />
            <div className="vinyl__label">SV</div>
            <div className="vinyl__hole" />
          </motion.div>
        </motion.div>

        <ExpStory d={d} rise={rise} />
        <ExpQuote d={d} rise={rise} delay={quoteDelay} />
        <ExpMedia d={d} rise={rise} delay={quoteDelay + 0.15} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
