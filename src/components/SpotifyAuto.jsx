import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Toca uma faixa do Spotify "automaticamente": como os navegadores bloqueiam
// autoplay com som, a reprodução começa no primeiro gesto (toque/clique/tecla)
// do usuário na página — o mais perto de automático que é possível.
//
// Usa a Spotify IFrame API oficial. Observação do Spotify: usuários sem login
// Premium ouvem apenas a prévia de ~30s; logados Premium ouvem a faixa inteira.

let apiPromise = null;
function loadSpotifyApi() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.SpotifyIframeApi) return resolve(window.SpotifyIframeApi);
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      window.SpotifyIframeApi = IFrameAPI;
      resolve(IFrameAPI);
    };
    const s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1";
    s.async = true;
    document.body.appendChild(s);
  });
  return apiPromise;
}

export default function SpotifyAuto({ trackId, label }) {
  const reduce = useReducedMotion();
  const holderRef = useRef(null);
  const controllerRef = useRef(null);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadSpotifyApi().then((IFrameAPI) => {
      if (cancelled || !holderRef.current) return;
      IFrameAPI.createController(
        holderRef.current,
        {
          uri: `spotify:track:${trackId}`,
          width: "100%",
          height: 80,
        },
        (controller) => {
          controllerRef.current = controller;
          controller.addListener("playback_update", (e) => {
            // isPaused === false => tocando
            setPlaying(e?.data?.isPaused === false);
          });
        }
      );
    });

    // Primeiro gesto na página inicia a faixa.
    function startOnGesture() {
      if (startedRef.current || reduce) return;
      const c = controllerRef.current;
      if (!c) return; // controller ainda não pronto — tenta no próximo gesto
      startedRef.current = true;
      try {
        c.play();
      } catch {
        /* ignore */
      }
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
      try {
        controllerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  function toggle() {
    const c = controllerRef.current;
    if (!c) return;
    startedRef.current = true;
    if (playing) c.pause();
    else c.play();
  }

  if (reduce) return null;

  return (
    <motion.div
      className="spotifyauto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      <div className="spotifyauto__player" ref={holderRef} />
      <button
        className="spotifyauto__hint"
        onClick={toggle}
        aria-label={playing ? `Pausar ${label}` : `Tocar ${label}`}
      >
        <span aria-hidden="true">{playing ? "♪ tocando" : "♪ toque para ouvir"}</span>
        <span className="spotifyauto__label">{label}</span>
      </button>
    </motion.div>
  );
}
