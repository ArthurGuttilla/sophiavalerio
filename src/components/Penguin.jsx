import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collectPenguin } from "../penguins.js";

// Hash simples para espalhar o pinguim em posições determinísticas por data.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Um pinguim escondido na tela da data. Clicou? Coleta, dá feedback e some.
export default function Penguin({ id, onCollect }) {
  const [burst, setBurst] = useState(false);
  const [gone, setGone] = useState(false);

  const h = hash(id);
  const left = 14 + (h % 68); // 14%..82%
  const top = 34 + ((h >>> 11) % 44); // 34%..78% (faixa segura, longe do topo)

  function grab() {
    if (burst) return;
    collectPenguin(id);
    onCollect && onCollect();
    setBurst(true);
    setTimeout(() => setGone(true), 700);
  }

  if (gone) return null;

  return (
    <div className="penguin" style={{ left: `${left}%`, top: `${top}%` }}>
      <AnimatePresence>
        {burst ? (
          <motion.span
            key="pop"
            className="penguin__pop"
            initial={{ opacity: 1, scale: 0.8, y: 0 }}
            animate={{ opacity: 0, scale: 1.6, y: -48 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            +1 🐧
          </motion.span>
        ) : (
          <motion.button
            key="btn"
            className="penguin__btn"
            onClick={grab}
            aria-label="coletar pinguim"
            title="um pinguim!"
            initial={{ scale: 0, rotate: -18 }}
            animate={{ scale: 1, rotate: 0, y: [0, -6, 0] }}
            transition={{
              scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              rotate: { duration: 0.4 },
              y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.8 }}
          >
            🐧
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
