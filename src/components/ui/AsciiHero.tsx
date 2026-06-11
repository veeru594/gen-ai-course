import { useEffect, useRef, useState } from "react";
import "./AsciiHero.css";

/* The terminal island as a hero: a student types at a prompt and the model
   answers the way a model actually answers — one token at a time. */

const GLYPH = [
  "      ░  ·  ░       █████╗ ██╗   ░      ",
  "   ·     ░         ██╔══██╗██║      ·   ",
  "      ░       ·    ███████║██║   ░      ",
  "  ░      ·         ██╔══██║██║       ·  ",
  "     ·       ░     ██║  ██║██║  ·       ",
  "  ·      ░         ╚═╝  ╚═╝╚═╝     ░    ",
  "           [ next-token predictor ]     ",
];

const SHIMMER_CHARS = ["░", "▒", "·", "∙"];

interface Exchange {
  q: string;
  // answer pre-split into "tokens" so the reply streams the way replies stream
  a: string[];
}

const EXCHANGES: Exchange[] = [
  {
    q: "how do you actually work?",
    a: ["one", " token", " at", " a", " time", " —", " this", " reply", " included", "."],
  },
  {
    q: "what should i learn first?",
    a: ["under", "stand", "ing", " first", ".", " tools", " second", "."],
  },
  {
    q: "which model is best?",
    a: ["wrong", " question", " —", " best", " for", " which", " task", "?"],
  },
  {
    q: "why do you hallucinate?",
    a: ["i", " predict", " plau", "sible", ",", " not", " true", ".", " ground", " me", " with", " RAG", "."],
  },
];

type Phase = "typing" | "streaming" | "holding";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function AsciiHero() {
  const reduced = usePrefersReducedMotion();
  const [exchange, setExchange] = useState(0);
  const [qChars, setQChars] = useState(0);
  const [aTokens, setATokens] = useState(0);
  const [frame, setFrame] = useState(0);
  const phase = useRef<Phase>("typing");

  // conversation loop
  useEffect(() => {
    if (reduced) {
      return;
    }
    const current = EXCHANGES[exchange];
    let t: number;

    if (phase.current === "typing") {
      if (qChars < current.q.length) {
        t = window.setTimeout(() => setQChars((c) => c + 1), 55);
      } else {
        phase.current = "streaming";
        t = window.setTimeout(() => setATokens(1), 500);
      }
    } else if (phase.current === "streaming") {
      if (aTokens < current.a.length) {
        t = window.setTimeout(() => setATokens((c) => c + 1), 170);
      } else {
        phase.current = "holding";
        t = window.setTimeout(() => {
          phase.current = "typing";
          setQChars(0);
          setATokens(0);
          setExchange((e) => (e + 1) % EXCHANGES.length);
        }, 3400);
      }
    }
    return () => window.clearTimeout(t);
  }, [reduced, exchange, qChars, aTokens]);

  // glyph shimmer
  useEffect(() => {
    if (reduced) {
      return;
    }
    const id = window.setInterval(() => setFrame((f) => f + 1), 220);
    return () => window.clearInterval(id);
  }, [reduced]);

  const current = EXCHANGES[exchange];
  const question = reduced ? current.q : current.q.slice(0, qChars);
  const answerTokens = reduced
    ? current.a
    : current.a.slice(0, aTokens);
  const questionDone = reduced || qChars >= current.q.length;
  const answerDone = reduced || answerTokens.length >= current.a.length;

  const art = GLYPH.map((line, row) =>
    line
      .split("")
      .map((ch, col) => {
        if (reduced || !SHIMMER_CHARS.includes(ch)) {
          return ch;
        }
        // cheap deterministic flicker per cell
        const n = (row * 31 + col * 17 + frame * 7) % SHIMMER_CHARS.length;
        return (row * 13 + col * 5 + frame) % 4 === 0 ? SHIMMER_CHARS[n] : ch;
      })
      .join(""),
  ).join("\n");

  return (
    <section className="ascii-hero" aria-label="Terminal demo: a student asks the model how it works, and the reply streams in one token at a time">
      <pre className="ascii-hero-art" aria-hidden="true">
        {art}
      </pre>
      <div className="ascii-hero-chat" aria-hidden="true">
        <pre className="ascii-hero-line">
          <span className="ascii-hero-user">student@course</span>
          <span className="ascii-hero-dim">:~$ </span>
          {question}
          {!questionDone && <span className="ascii-hero-cursor">▌</span>}
        </pre>
        <pre className="ascii-hero-line">
          <span className="ascii-hero-model">         model</span>
          <span className="ascii-hero-dim">{">  "}</span>
          {answerTokens.map((tok, i) => (
            <span key={i} className="ascii-hero-token">
              {tok}
            </span>
          ))}
          {questionDone && !answerDone && (
            <span className="ascii-hero-cursor">▌</span>
          )}
        </pre>
      </div>
    </section>
  );
}
