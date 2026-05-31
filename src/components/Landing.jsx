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
      className="stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Motif variant="dust" />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}
      >
        <motion.h1 variants={item} className="wordmark">
          Sophia Valerio
        </motion.h1>
        <motion.button
          variants={item}
          className="btn"
          onClick={() => navigate("/home")}
        >
          Start
        </motion.button>
      </motion.div>
    </motion.main>
  );
}
