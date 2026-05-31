import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useRise, ExpBack, ExpHeader, ExpStory, ExpQuote, ExpMedia, ExpFoot,
} from "../components/expParts.jsx";

// Visible keyboard: C4..D6 so all melody notes can light up.
const WHITE = [
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6",
];
const BLACK = {
  C4: "C#4", D4: "D#4", F4: "F#4", G4: "G#4", A4: "A#4",
  C5: "C#5", D5: "D#5", F5: "F#5", G5: "G#5", A5: "A#5",
  C6: "C#6", D6: "D#6",
};

const SEMITONE = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
function freq(note) {
  const m = note.match(/^([A-G]#?)(-?\d)$/);
  const midi = SEMITONE[m[1]] + (parseInt(m[2], 10) + 1) * 12;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// ── Arrangement: a wistful 3/4 waltz in A minor, in the spirit of
//    "Mia & Sebastian's Theme" — rolling left-hand bass + triad, singing
//    right-hand melody. Each measure is 3 beats.
const BPM = 104;
const CHORDS = {
  Am: ["A3", "C4", "E4"], E: ["G#3", "B3", "E4"], C: ["G3", "C4", "E4"],
  G: ["G3", "B3", "D4"], F: ["F3", "A3", "C4"], Dm: ["D3", "F3", "A3"],
};
const BASS = { Am: "A2", E: "E2", C: "C3", G: "G2", F: "F2", Dm: "D3" };

// Evocação do tema principal de "Mia & Sebastian's Theme": um arpejo de
// valsa que sobe e desce com a melodia cantando por cima. Não é a partitura
// exata (protegida), mas segue o contorno e o clima reconhecível da peça.
// [chord, melody events: [note, beatOffset, beats]]
const SONG = [
  ["Am", [["A4", 0, 0.5], ["C5", 0.5, 0.5], ["E5", 1, 1], ["A5", 2, 1]]],
  ["E",  [["G#5", 0, 1.5], ["E5", 1.5, 0.5], ["B4", 2, 1]]],
  ["F",  [["A4", 0, 0.5], ["C5", 0.5, 0.5], ["F5", 1, 1], ["A5", 2, 1]]],
  ["C",  [["G5", 0, 1.5], ["E5", 1.5, 0.5], ["C5", 2, 1]]],
  ["Dm", [["D5", 0, 0.5], ["F5", 0.5, 0.5], ["A5", 1, 1], ["D6", 2, 1]]],
  ["Am", [["C6", 0, 1], ["A5", 1, 1], ["E5", 2, 1]]],
  ["E",  [["B4", 0, 0.5], ["E5", 0.5, 0.5], ["G#5", 1, 1], ["B5", 2, 1]]],
  ["Am", [["A5", 0, 1.5], ["E5", 1.5, 0.5], ["A4", 2, 1]]],
];

export default function PianoScene({ d, onBack }) {
  const rise = useRise();
  const quoteDelay = 0.3 + d.story.length * 0.12 + 0.1;

  const engine = useRef(null);
  const [active, setActive] = useState({}); // note -> lit
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]);

  // Build (once) the audio graph: master + a generated reverb tail.
  function getEngine() {
    if (engine.current) return engine.current;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();

    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    // Simple convolution reverb from a decaying noise impulse.
    const len = Math.floor(ctx.sampleRate * 1.8);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
      }
    }
    const reverb = ctx.createConvolver();
    reverb.buffer = buf;
    const wet = ctx.createGain();
    wet.gain.value = 0.22;
    reverb.connect(wet);
    wet.connect(ctx.destination);
    master.connect(reverb);

    engine.current = { ctx, master };
    return engine.current;
  }

  // A single piano-like note: detuned partials, lowpass with motion,
  // and a percussive ADSR for a struck-string feel.
  function voice(note, when, dur, peak = 0.16) {
    const { ctx, master } = getEngine();
    const t0 = ctx.currentTime + when;
    const f = freq(note);

    const o1 = ctx.createOscillator();
    o1.type = "triangle";
    o1.frequency.value = f;
    o1.detune.value = -4;

    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = f * 2; // 2nd partial for brightness
    o2.detune.value = 5;
    const o2g = ctx.createGain();
    o2g.gain.value = 0.3;

    const o3 = ctx.createOscillator();
    o3.type = "sine";
    o3.frequency.value = f * 3; // shimmer
    const o3g = ctx.createGain();
    o3g.gain.value = 0.08;

    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(Math.min(9000, f * 9), t0);
    filt.frequency.exponentialRampToValueAtTime(Math.max(700, f * 2.5), t0 + dur);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.008);     // attack
    g.gain.exponentialRampToValueAtTime(peak * 0.45, t0 + 0.14); // decay→sustain
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);     // release

    o1.connect(g);
    o2.connect(o2g).connect(g);
    o3.connect(o3g).connect(g);
    g.connect(filt).connect(master);

    const stop = t0 + dur + 0.12;
    o1.start(t0); o2.start(t0); o3.start(t0);
    o1.stop(stop); o2.stop(stop); o3.stop(stop);
  }

  function light(note, delayMs, holdMs) {
    const on = setTimeout(() => setActive((a) => ({ ...a, [note]: true })), delayMs);
    const off = setTimeout(() => setActive((a) => ({ ...a, [note]: false })), delayMs + holdMs);
    timers.current.push(on, off);
  }

  function playMelody() {
    if (playing) return;
    const { ctx } = getEngine();
    if (ctx.state === "suspended") ctx.resume();
    setPlaying(true);

    const beat = 60 / BPM;
    let totalMs = 0;

    SONG.forEach(([chord, melody], m) => {
      const mStart = m * 3; // measure start in beats

      // Left hand: bass on beat 1, triad on beats 2 and 3 (waltz "oom-pah-pah").
      voice(BASS[chord], (mStart + 0) * beat, beat * 2.6, 0.13);
      [1, 2].forEach((b) => {
        CHORDS[chord].forEach((n) =>
          voice(n, (mStart + b) * beat, beat * 0.8, 0.06)
        );
      });

      // Right hand: melody (lights the keys).
      melody.forEach(([note, off, beats]) => {
        const when = (mStart + off) * beat;
        const dur = beats * beat * 0.96;
        voice(note, when, dur, 0.2);
        light(note, when * 1000, Math.max(200, dur * 1000 * 0.8));
        totalMs = Math.max(totalMs, (when + dur) * 1000);
      });
    });

    const end = setTimeout(() => setPlaying(false), totalMs + 300);
    timers.current.push(end);
  }

  function tap(note) {
    const { ctx } = getEngine();
    if (ctx.state === "suspended") ctx.resume();
    voice(note, 0, 1.1, 0.2);
    setActive((a) => ({ ...a, [note]: true }));
    setTimeout(() => setActive((a) => ({ ...a, [note]: false })), 240);
  }

  // Cleanup any pending timers on unmount.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

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
