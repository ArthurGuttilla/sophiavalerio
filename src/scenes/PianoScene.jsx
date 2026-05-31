import { useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpMedia, ExpFoot,
} from "../components/expParts.jsx";

// One octave and a bit, C4..E5, as a simple playable keyboard.
// white keys + their black neighbours.
const WHITE = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"];
const BLACK = { C4: "C#4", D4: "D#4", F4: "F#4", G4: "G#4", A4: "A#4", C5: "C#5", D5: "D#5" };

const SEMITONE = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
function freq(note) {
  const m = note.match(/^([A-G]#?)(\d)$/);
  const midi = SEMITONE[m[1]] + (parseInt(m[2], 10) + 1) * 12;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// An evocation of the opening arpeggio of "Mia & Sebastian's Theme".
// [note, startBeat, beats]
const MELODY = [
  ["E4", 0, 1], ["A4", 1, 1], ["B4", 2, 1], ["C5", 3, 1.5],
  ["B4", 4.5, 0.5], ["A4", 5, 1], ["E4", 6, 1], ["A4", 7, 1],
  ["C5", 8, 1], ["B4", 9, 1], ["A4", 10, 1.5], ["G4", 11.5, 0.5],
  ["A4", 12, 2],
];
const BPM = 96;

export default function PianoScene({ d, onBack }) {
  const rise = useRise();
  const reduce = useReducedMotion();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  const audioRef = useRef(null);
  const [active, setActive] = useState({}); // note -> true while lit
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]);

  function ac() {
    if (!audioRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioRef.current = new Ctx();
    }
    return audioRef.current;
  }

  function strike(note, when, dur) {
    const ctx = ac();
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    // Two oscillators for a slightly richer, piano-ish tone.
    osc.type = "triangle";
    osc.frequency.value = freq(note);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function light(note, delayMs, holdMs) {
    const on = setTimeout(() => setActive((a) => ({ ...a, [note]: true })), delayMs);
    const off = setTimeout(() => setActive((a) => ({ ...a, [note]: false })), delayMs + holdMs);
    timers.current.push(on, off);
  }

  function playMelody() {
    if (playing) return;
    const ctx = ac();
    if (ctx.state === "suspended") ctx.resume();
    setPlaying(true);
    const beat = 60 / BPM;
    let totalMs = 0;
    MELODY.forEach(([note, start, beats]) => {
      const when = start * beat;
      const dur = beats * beat * 0.95;
      strike(note, when, dur);
      light(note, when * 1000, Math.max(180, dur * 1000 * 0.7));
      totalMs = Math.max(totalMs, (when + dur) * 1000);
    });
    const end = setTimeout(() => setPlaying(false), totalMs + 200);
    timers.current.push(end);
  }

  function tap(note) {
    const ctx = ac();
    if (ctx.state === "suspended") ctx.resume();
    strike(note, 0, 0.9);
    setActive((a) => ({ ...a, [note]: true }));
    setTimeout(() => setActive((a) => ({ ...a, [note]: false })), 220);
  }

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
        <ExpStory d={d} rise={rise} />

        <motion.div className="piano" {...rise(0.3 + d.story.length * 0.12)}>
          <div className="piano__keys" role="group" aria-label="piano">
            {WHITE.map((note) => (
              <div className="piano__wkeywrap" key={note}>
                <button
                  className={`piano__wkey ${active[note] ? "is-on" : ""}`}
                  onClick={() => tap(note)}
                  aria-label={note}
                />
                {BLACK[note] && (
                  <button
                    className={`piano__bkey ${active[BLACK[note]] ? "is-on" : ""}`}
                    onClick={(e) => { e.stopPropagation(); tap(BLACK[note]); }}
                    aria-label={BLACK[note]}
                  />
                )}
              </div>
            ))}
          </div>
          <button className="btn btn--ghost piano__play" onClick={playMelody} disabled={playing}>
            {playing ? "tocando…" : "▶ tocar nosso tema"}
          </button>
          <AnimatePresence>
            {playing && (
              <motion.span
                className="piano__floating"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.6, 0], y: -40 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              >
                ♪ ♫ ♪
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <ExpQuote d={d} rise={rise} delay={quoteDelay} />
        <ExpMedia d={d} rise={rise} delay={quoteDelay + 0.15} />
        <ExpFoot rise={rise} delay={quoteDelay + 0.3} onBack={onBack} />
      </article>
    </motion.main>
  );
}
