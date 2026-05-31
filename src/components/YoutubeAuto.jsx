import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Toca o áudio de um vídeo do YouTube sem mostrar o embed: o player fica
// oculto (1×1, fora da tela) e a reprodução começa no primeiro gesto do
// usuário na página (navegadores bloqueiam autoplay com som antes disso).
// Um controle mínimo e discreto permite pausar / religar.

let apiPromise = null;
function loadYouTubeApi() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev && prev();
      resolve(window.YT);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.body.appendChild(s);
  });
  return apiPromise;
}

export default function YoutubeAuto({ videoId, start = 0, label }) {
  const reduce = useReducedMotion();
  const holderRef = useRef(null);
  const playerRef = useRef(null);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !holderRef.current) return;
      playerRef.current = new YT.Player(holderRef.current, {
        videoId,
        width: 1,
        height: 1,
        playerVars: {
          start,
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            setReady(true);
            if (startedRef.current && !reduce) {
              try { playerRef.current.playVideo(); } catch { /* ignore */ }
            }
          },
          onStateChange: (e) => {
            // 1 = tocando, 2 = pausado, 0 = fim
            setPlaying(e.data === 1);
          },
        },
      });
    });

    function startOnGesture() {
      if (startedRef.current || reduce) return;
      startedRef.current = true;
      const p = playerRef.current;
      if (p && p.playVideo) { try { p.playVideo(); } catch { /* ignore */ } }
      detach();
    }
    function detach() {
      window.removeEventListener("pointerdown", startOnGesture);
      window.removeEventListener("keydown", startOnGesture);
      window.removeEventListener("touchstart", startOnGesture);
    }
    window.addEventListener("pointerdown", startOnGesture);
    window.addEventListener("keydown", startOnGesture);
    window.addEventListener("touchstart", startOnGesture);

    return () => {
      cancelled = true;
      detach();
      try { playerRef.current?.destroy?.(); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, start]);

  function toggle() {
    const p = playerRef.current;
    if (!p) return;
    startedRef.current = true;
    if (playing) { try { p.pauseVideo(); } catch { /* ignore */ } }
    else { try { p.playVideo(); } catch { /* ignore */ } }
  }

  if (reduce) return null;

  return (
    <motion.div
      className="ytauto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* player oculto (necessário para tocar, mas invisível) */}
      <div className="ytauto__hidden" aria-hidden="true">
        <div ref={holderRef} />
      </div>

      <button
        className={`ytauto__chip ${playing ? "is-playing" : ""}`}
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? `Pausar ${label}` : `Tocar ${label}`}
      >
        <span className="ytauto__eq" aria-hidden="true"><i /><i /><i /></span>
        <span className="ytauto__label">{label}</span>
      </button>
    </motion.div>
  );
}
