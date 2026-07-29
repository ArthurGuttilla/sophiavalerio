import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  termsMeta, termsIntro, termsClauses, termsFinal,
} from "../data/terms.js";

const STORE_KEY = "sv_terms_signed";

function loadSigned() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function todayStr() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd} / ${mm} / ${d.getFullYear()}`;
}

export default function Terms() {
  const [open, setOpen] = useState(false);
  const [signed, setSigned] = useState(loadSigned);
  const [hasSig, setHasSig] = useState(false);
  const [toast, setToast] = useState(false);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);

  const accepted = !!signed;
  const dateStr = signed?.date || todayStr();

  // Prepara o canvas de assinatura quando o modal abre (e ainda não assinado).
  useEffect(() => {
    if (!open || accepted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, rect.width * dpr);
    canvas.height = Math.max(1, rect.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#3e342b";
    ctxRef.current = ctx;
    setHasSig(false);
  }, [open, accepted]);

  function pos(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function down(e) {
    if (accepted) return;
    e.preventDefault();
    drawing.current = true;
    const p = pos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(p.x, p.y);
    canvasRef.current.setPointerCapture?.(e.pointerId);
  }
  function move(e) {
    if (!drawing.current) return;
    const p = pos(e);
    ctxRef.current.lineTo(p.x, p.y);
    ctxRef.current.stroke();
    if (!hasSig) setHasSig(true);
  }
  function up() {
    drawing.current = false;
  }
  function clearSig() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setHasSig(false);
  }

  function accept() {
    if (!hasSig) return;
    let sig = "";
    try { sig = canvasRef.current.toDataURL("image/png"); } catch { /* ignore */ }
    const record = { accepted: true, date: todayStr(), sig };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(record)); } catch { /* ignore */ }
    setSigned(record);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setOpen(false);
    }, 2000);
  }

  function onCheckboxClick(e) {
    if (!accepted) {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div className="terms">
      <label className="terms__agree">
        <input
          type="checkbox"
          className="terms__check"
          checked={accepted}
          readOnly
          onClick={onCheckboxClick}
        />
        <span>
          Li e concordo com os{" "}
          <button type="button" className="terms__link" onClick={() => setOpen(true)}>
            termos de uso
          </button>
          {accepted && <span className="terms__done"> · assinado em {dateStr} 🤍</span>}
        </span>
      </label>

      <AnimatePresence>
        {open && (
          <motion.div
            className="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="modal__backdrop" onClick={() => setOpen(false)} />
            <motion.div
              className="modal__box"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label={termsMeta.title}
            >
              <button className="modal__close" onClick={() => setOpen(false)} aria-label="fechar">
                ×
              </button>

              <div className="terms__doc">
                <h2 className="terms__title">{termsMeta.title}</h2>
                <p className="terms__version">{termsMeta.version}</p>
                <p className="terms__intro">{termsIntro}</p>

                {termsClauses.map((c) => (
                  <section className="terms__clause" key={c.h}>
                    <h3 className="terms__h">{c.h}</h3>
                    {c.p.map((para, i) => (
                      <p className="terms__p" key={i}>{para}</p>
                    ))}
                  </section>
                ))}

                <section className="terms__clause">
                  <h3 className="terms__h">{termsFinal.h}</h3>
                  {termsFinal.p.map((para, i) => (
                    <p className="terms__p" key={i}>{para}</p>
                  ))}
                </section>

                <p className="terms__accept-line">Li e concordo com os termos.</p>

                <div className="terms__sigs">
                  <div className="terms__sig">
                    <span className="terms__sig-name terms__sig-arthur">Arthur Guttilla</span>
                    <span className="terms__sig-label">Arthur Guttilla</span>
                  </div>

                  <div className="terms__sig">
                    {accepted ? (
                      signed.sig ? (
                        <img className="terms__sig-img" src={signed.sig} alt="assinatura de Sophia" />
                      ) : (
                        <span className="terms__sig-name">✓ assinado</span>
                      )
                    ) : (
                      <canvas
                        ref={canvasRef}
                        className="terms__pad"
                        onPointerDown={down}
                        onPointerMove={move}
                        onPointerUp={up}
                        onPointerLeave={up}
                        onPointerCancel={up}
                      />
                    )}
                    <span className="terms__sig-label">Sophia Valerio</span>
                  </div>
                </div>

                <p className="terms__date">Data: {dateStr}</p>
                {!accepted && (
                  <p className="terms__hint">Assine acima, no campo da Sophia, com o dedo ou o mouse.</p>
                )}
              </div>

              <div className="terms__actions">
                {accepted ? (
                  <button className="btn" onClick={() => setOpen(false)}>fechar</button>
                ) : (
                  <>
                    <button className="btn btn--ghost" onClick={clearSig} disabled={!hasSig}>
                      limpar
                    </button>
                    <button className="btn" onClick={accept} disabled={!hasSig}>
                      li e concordo
                    </button>
                  </>
                )}
              </div>

              <AnimatePresence>
                {toast && (
                  <motion.div
                    className="terms__toast"
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    não tem volta, apenas revisão 🤍
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
