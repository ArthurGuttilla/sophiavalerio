import { motion } from "framer-motion";
import Motif from "../components/Motif.jsx";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpPhoto, ExpFoot,
} from "../components/expParts.jsx";
import Carousel from "../components/Carousel.jsx";

// Dia 19/06 — a viagem. Cabeçalho, foto e a narrativa do dia.
export default function TripScene({ d, onBack }) {
  const rise = useRise();

  return (
    <motion.main
      className="exp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Motif variant={d.motif} seed={d.id.length * 13 + 5} />
      <ExpBack onClick={onBack} />
      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />
        {d.photos ? (
          <Carousel items={d.photos} rise={rise} delay={0.3} />
        ) : (
          (d.photo || d.photoPlaceholder) && <ExpPhoto d={d} rise={rise} delay={0.3} />
        )}
        <ExpStory d={d} rise={rise} base={0.45} />
        <ExpFoot rise={rise} delay={0.9} onBack={onBack} />
      </article>
    </motion.main>
  );
}
