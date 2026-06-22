import { useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Motif from "./Motif.jsx";
import { getDate } from "../data/dates.js";
import { secretDate, SECRET_ID, tripDate, TRIP_ID, officialDate, OFFICIAL_ID } from "../data/secret.js";
import { canAccess, markSeen, allSeen } from "../progress.js";
import { PENGUIN_DATES, hasPenguin, allPenguins } from "../penguins.js";
import Penguin from "./Penguin.jsx";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpMedia, ExpVideo, ExpFoot,
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
        <ExpVideo d={d} rise={rise} delay={quoteDelay + 0.05} />
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

  // Datas pós-final (secreta e viagem): liberadas só depois de ver todas as
  // datas E coletar os 10 pinguins.
  const isSecret = id === SECRET_ID;
  const isTrip = id === TRIP_ID;
  const isOfficial = id === OFFICIAL_ID;
  const isPostFinal = isSecret || isTrip || isOfficial;
  const d = isSecret
    ? secretDate
    : isTrip
    ? tripDate
    : isOfficial
    ? officialDate
    : getDate(id);

  // Guarda de acesso: bloqueia deep-link para data ainda trancada.
  const allowed = isPostFinal ? allSeen() && allPenguins() : d ? canAccess(id) : false;

  // Marca a data como vista (libera a próxima) ao abrir.
  useEffect(() => {
    if (d && allowed && !isPostFinal) markSeen(id);
  }, [id, d, allowed, isPostFinal]);

  if (!d || !allowed) return <Navigate to="/home" replace />;

  const onBack = () => navigate("/home");
  const Scene = d.scene && SCENES[d.scene];
  const showPenguin = !isSecret && PENGUIN_DATES.includes(id) && !hasPenguin(id);

  return (
    <>
      {Scene ? <Scene d={d} onBack={onBack} /> : <DefaultExperience d={d} onBack={onBack} />}
      {showPenguin && <Penguin id={id} />}
    </>
  );
}
