import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Motif from "./Motif.jsx";

export default function Landing() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.18, delayChildren: 0.1 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.main
      className="stage stage--enter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate("/home")}
      role="button"
      tabIndex={0}
      aria-label="Toque para começar"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate("/home");
        }
      }}
    >
      <Motif variant="dust" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-6)" }}
      >
        <motion.h1 variants={item} className="wordmark">
          Sophia Valerio
        </motion.h1>
        <motion.span
          variants={item}
          className="enter-hint"
          animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
          transition={reduce ? {} : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          toque para começar
        </motion.span>
      </motion.div>
    </motion.main>
  );
}
