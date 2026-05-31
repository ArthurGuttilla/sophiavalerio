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
  const wantPlayRef = useRef(false); // gesto pediu play antes do controller existir?
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

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
          setReady(true);
          controller.addListener("playback_update", (e) => {
            setPlaying(e?.data?.isPaused === false);
          });
          // Se o usuário já tocou na tela antes do player ficar pronto,
          // dispara o play assim que ele existir.
          if (wantPlayRef.current && !reduce) {
            try { controller.play(); } catch { /* ignore */ }
          }
        }
      );
    });

    // Primeiro gesto na página inicia a faixa.
    function startOnGesture() {
      if (startedRef.current || reduce) return;
      startedRef.current = true;
      wantPlayRef.current = true;
      const c = controllerRef.current;
      if (c) {
        try { c.play(); } catch { /* ignore */ }
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
      {/* Player do Spotify fora da tela: necessário para tocar, mas oculto. */}
      <div className="spotifyauto__player" ref={holderRef} aria-hidden="true" />

      <button
        className={`spotifyauto__chip ${playing ? "is-playing" : ""}`}
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? `Pausar ${label}` : `Tocar ${label}`}
      >
        <span className="spotifyauto__eq" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="spotifyauto__label">{label}</span>
      </button>
    </motion.div>
  );
}
