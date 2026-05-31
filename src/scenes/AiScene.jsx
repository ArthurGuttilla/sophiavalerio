import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpFoot,
} from "../components/expParts.jsx";

// Uma "conversa" estilizada com o Claude: o prompt é digitado letra a letra
// e a resposta surge em streaming — metáfora da inteligência que a gente
// compartilha. Tudo é simulado (sem chamadas de rede).
const PROMPT = "O que a Sophia e eu temos em comum?";
const ANSWER = [
  "Vocês dois funcionam como boas inteligências: aprendem rápido, trocam contexto o tempo todo e ficam melhores a cada interação.",
  "A diferença é o que move o aprendizado. Uma IA é treinada por dados; vocês, por curiosidade e afeto.",
  "Compartilham a mesma fome de entender o mundo — e descobriram que pensar junto é mais potente do que pensar sozinho.",
  "No fim, a inteligência mais rara que vocês dividem não se mede em parâmetros: é a vontade de continuar aprendendo um com o outro.",
];

export default function AiScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  const [typed, setTyped] = useState(reduce ? PROMPT : "");
  const [sent, setSent] = useState(reduce);
  const [visibleLines, setVisibleLines] = useState(reduce ? ANSWER.length : 0);
  const timers = useRef([]);

  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const speed = 55;
    const typeNext = () => {
      i++;
      setTyped(PROMPT.slice(0, i));
      if (i < PROMPT.length) {
        timers.current.push(setTimeout(typeNext, speed));
      } else {
        // "Enviar" e começar a responder.
        timers.current.push(
          setTimeout(() => {
            setSent(true);
            ANSWER.forEach((_, idx) => {
              timers.current.push(
                setTimeout(() => setVisibleLines(idx + 1), 700 + idx * 1100)
              );
            });
          }, 500)
        );
      }
    };
    timers.current.push(setTimeout(typeNext, 700));
    return () => timers.current.forEach(clearTimeout);
  }, [reduce]);

  return (
    <motion.main
      className="exp"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ExpBack onClick={onBack} />
      <article className="exp__inner">
        <ExpHeader d={d} rise={rise} />

        <motion.div className="ai" {...rise(0.3)}>
          <div className="ai__bar" aria-hidden="true">
            <span className="ai__dot" /><span className="ai__dot" /><span className="ai__dot" />
            <span className="ai__name">Claude</span>
          </div>

          <div className="ai__thread">
            {/* prompt do usuário */}
            <div className="ai__msg ai__msg--user">
              <span className="ai__role">você</span>
              <span className="ai__text">
                {typed}
                {!sent && <span className="ai__caret" aria-hidden="true" />}
              </span>
            </div>

            {/* resposta do Claude */}
            {sent && (
              <div className="ai__msg ai__msg--bot">
                <span className="ai__role ai__role--bot">✶ Claude</span>
                <span className="ai__text">
                  {ANSWER.slice(0, visibleLines).map((line, i) => (
                    <motion.span
                      key={i}
                      className="ai__line"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {line}
                    </motion.span>
                  ))}
                  {visibleLines < ANSWER.length && (
                    <span className="ai__typing" aria-hidden="true">
                      <i /><i /><i />
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <ExpStory d={d} rise={rise} base={0.5} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
