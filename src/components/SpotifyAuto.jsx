import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Player compacto e elegante do Spotify para a faixa da data.
// Usa a Spotify IFrame API oficial (player pequeno, 80px). Tenta iniciar a
// reprodução no primeiro gesto do usuário; se o navegador bloquear (comum
// fora do Premium/logado), basta um toque no player.

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

  useEffect(() => {
    let cancelled = false;

    loadSpotifyApi().then((IFrameAPI) => {
      if (cancelled || !holderRef.current) return;
      IFrameAPI.createController(
        holderRef.current,
        { uri: `spotify:track:${trackId}`, width: "100%", height: 80 },
        (controller) => {
          controllerRef.current = controller;
          // Se já houve um gesto, tenta tocar assim que o player existe.
          if (startedRef.current && !reduce) {
            try { controller.play(); } catch { /* ignore */ }
          }
        }
      );
    });

    // Primeiro gesto na página tenta iniciar a faixa.
    function startOnGesture() {
      if (startedRef.current || reduce) return;
      startedRef.current = true;
      const c = controllerRef.current;
      if (c) { try { c.play(); } catch { /* ignore */ } }
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
      try { controllerRef.current?.destroy?.(); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  if (reduce) return null;

  return (
    <motion.div
      className="spotifyauto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="spotifyauto__player" ref={holderRef} />
    </motion.div>
  );
}
