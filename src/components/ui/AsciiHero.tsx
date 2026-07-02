import { useEffect, useRef, useState } from "react";
import "./AsciiHero.css";

/* The terminal island as a hero: an ASCII bot that visibly speaks —
   mouth animating while its reply streams in token-sized chunks. */

interface Exchange {
  q: string;
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
  {
    q: "can you replace engineers?",
    a: ["no", ".", " i", " make", " the", " ones", " who", " understand", " me", " faster", "."],
  },
];

const MOUTHS = ["▃▃▃▃▃", "▂▃█▃▂", "▂███▂", "▃▂▂▂▃", "▃▃█▃▃"];

type Phase = "typing" | "streaming" | "holding";

/* idle micro-actions, Claude-Code-in-the-terminal style */
type BotAction =
  | "none"
  | "look-left"
  | "look-right"
  | "wiggle"
  | "hop"
  | "tilt"
  | "walk";

const IDLE_ACTIONS: BotAction[] = [
  "look-left",
  "look-right",
  "wiggle",
  "hop",
  "tilt",
  "walk",
];

const SPINNER = "|/-\\";
const VERBS = ["tokenizing", "attending", "sampling"];

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

function buildBot(opts: {
  speaking: boolean;
  blink: boolean;
  frame: number;
  action: BotAction;
}): string {
  const { speaking, blink, frame, action } = opts;
  const eye = blink
    ? "▁"
    : action === "look-left" || action === "walk"
      ? "▌"
      : action === "look-right"
        ? "▐"
        : "█";
  const mouth = speaking ? MOUTHS[frame % MOUTHS.length] : "▃▃▃▃▃";
  const wiggling = action === "wiggle";
  const tip =
    speaking || wiggling ? (frame % 2 === 0 ? "●" : "○") : "○";
  const stem = wiggling ? ["╱", "│", "╲", "│"][frame % 4] : "│";
  const w = speaking ? "≈" : " ";
  // every row is exactly 19 columns wide
  return [
    `         ${tip}         `,
    `         ${stem}         `,
    "  ╔══════╧══════╗  ",
    `══╣   ${eye}     ${eye}   ╠══`,
    "  ║             ║  ",
    ` ${w}║    ${mouth}    ║${w} `,
    "  ╚═════════════╝  ",
    "   ═══╡ • • ╞═══   ",
  ].join("\n");
}

export function AsciiHero() {
  const reduced = usePrefersReducedMotion();
  const [exchange, setExchange] = useState(0);
  const [qChars, setQChars] = useState(0);
  const [aTokens, setATokens] = useState(0);
  const [frame, setFrame] = useState(0);
  const [action, setAction] = useState<BotAction>("none");
  const phase = useRef<Phase>("typing");
  const speakingRef = useRef(false);

  // every few seconds of idle time, do a small random action
  useEffect(() => {
    if (reduced) {
      return;
    }
    const id = window.setInterval(() => {
      if (speakingRef.current) {
        return;
      }
      const pick =
        IDLE_ACTIONS[Math.floor(Math.random() * IDLE_ACTIONS.length)];
      setAction(pick);
      window.setTimeout(() => setAction("none"), 1500);
    }, 3400);
    return () => window.clearInterval(id);
  }, [reduced]);

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
        t = window.setTimeout(() => setATokens((c) => c + 1), 180);
      } else {
        phase.current = "holding";
        t = window.setTimeout(() => {
          phase.current = "typing";
          setQChars(0);
          setATokens(0);
          setExchange((e) => (e + 1) % EXCHANGES.length);
        }, 3200);
      }
    }
    return () => window.clearTimeout(t);
  }, [reduced, exchange, qChars, aTokens]);

  // face animation tick (mouth while speaking, periodic blink)
  useEffect(() => {
    if (reduced) {
      return;
    }
    const id = window.setInterval(() => setFrame((f) => f + 1), 150);
    return () => window.clearInterval(id);
  }, [reduced]);

  const current = EXCHANGES[exchange];
  const question = reduced ? current.q : current.q.slice(0, qChars);
  const answerTokens = reduced ? current.a : current.a.slice(0, aTokens);
  const questionDone = reduced || qChars >= current.q.length;
  const answerDone = reduced || answerTokens.length >= current.a.length;
  const speaking = !reduced && questionDone && !answerDone && aTokens > 0;
  speakingRef.current = speaking;
  const blink = !reduced && !speaking && action === "none" && frame % 20 === 0;
  const moveClass =
    action === "hop" || action === "tilt" || action === "walk"
      ? ` bot-${action}`
      : "";

  return (
    <section
      className="ascii-hero"
      aria-label="Terminal demo: an ASCII robot answers questions, streaming its reply one token at a time"
    >
      <div className="ascii-hero-main">
        <div className="ascii-hero-chat" aria-hidden="true">
          <pre className="ascii-hero-line">
            <span className="ascii-hero-user">{"you   ▸ "}</span>
            {question}
            {!questionDone && <span className="ascii-hero-cursor">▌</span>}
          </pre>
          <pre className="ascii-hero-line">
            <span className="ascii-hero-model">{"model ▸ "}</span>
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

        <div className="ascii-hero-top" aria-hidden="true">
          <pre
            className={`ascii-hero-bot${moveClass}${speaking ? " is-speaking" : ""}`}
          >
            {buildBot({ speaking, blink, frame, action })}
          </pre>
          <p className="ascii-hero-caption">[ next-token predictor ]</p>
        </div>
      </div>

      <p className="ascii-hero-status" aria-hidden="true">
        <span>T=0.70</span>
        <span>
          {speaking
            ? `${SPINNER[frame % SPINNER.length]} ${VERBS[Math.floor(frame / 5) % VERBS.length]}…`
            : "stream: idle"}
        </span>
        <span>ctx: 200k</span>
        <span title="signed, the painter">vk.</span>
      </p>
    </section>
  );
}
