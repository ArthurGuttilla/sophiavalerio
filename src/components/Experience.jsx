import { useParams, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Motif from "./Motif.jsx";
import { getDate } from "../data/dates.js";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpMedia, ExpFoot,
} from "./expParts.jsx";
import { SCENES } from "../scenes/index.jsx";

function DefaultExperience({ d, onBack }) {
  const rise = useRise();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;
  return (
    <motion.main
      className="exp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Motif variant={d.motif} seed={d.id.length * 13 + 3} />
      <ExpBack onClick={onBack} />
      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />
        <ExpStory d={d} rise={rise} />
        <ExpQuote d={d} rise={rise} delay={quoteDelay} />
        <ExpMedia d={d} rise={rise} delay={quoteDelay + 0.15} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}

export default function Experience() {
  const { id } = useParams();
  const navigate = useNavigate();
  const d = getDate(id);

  if (!d) return <Navigate to="/home" replace />;

  const onBack = () => navigate("/home");
  const Scene = d.scene && SCENES[d.scene];

  return Scene ? <Scene d={d} onBack={onBack} /> : <DefaultExperience d={d} onBack={onBack} />;
}
