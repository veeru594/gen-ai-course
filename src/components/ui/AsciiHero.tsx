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

const RAIN_CHARS = "01<>{}[]/=+*#$%&;:atoknesrlmpv░▒";

/** Matrix-style token rain on a canvas behind the bot. */
function useTokenRain(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled || typeof ResizeObserver === "undefined") {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    const fontSize = 13;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;

    function resize() {
      if (!canvas || !ctx) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
      const cols = Math.max(1, Math.floor(canvas.width / fontSize));
      drops = Array.from({ length: cols }, () =>
        Math.floor(Math.random() * -60),
      );
      ctx.fillStyle = "#16181d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    function frame(t: number) {
      raf = window.requestAnimationFrame(frame);
      if (t - last < 75 || !canvas || !ctx) {
        return;
      }
      last = t;
      // translucent wipe leaves fading trails behind each drop
      ctx.fillStyle = "rgba(22, 24, 29, 0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        if (y > 0) {
          const ch = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
          ctx.fillStyle =
            Math.random() < 0.08
              ? "rgba(255, 226, 74, 0.8)" // the occasional highlighter token
              : "rgba(126, 224, 163, 0.55)";
          ctx.fillText(ch, i * fontSize, y);
        }
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -30);
        } else {
          drops[i]++;
        }
      }
    }
    raf = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [canvasRef, enabled]);
}

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
}): string {
  const { speaking, blink, frame } = opts;
  const eye = blink ? "▁" : "█";
  const mouth = speaking ? MOUTHS[frame % MOUTHS.length] : "▃▃▃▃▃";
  const tip = speaking ? (frame % 2 === 0 ? "●" : "○") : "○";
  const w = speaking ? "≈" : " ";
  // every row is exactly 19 columns wide
  return [
    `         ${tip}         `,
    "         │         ",
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
  const phase = useRef<Phase>("typing");
  const rainRef = useRef<HTMLCanvasElement>(null);

  useTokenRain(rainRef, !reduced);

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
  const blink = !reduced && !speaking && frame % 20 === 0;

  return (
    <section
      className="ascii-hero"
      aria-label="Terminal demo: an ASCII robot answers questions, streaming its reply one token at a time"
    >
      <canvas className="ascii-hero-rain" ref={rainRef} aria-hidden="true" />
      <div className="ascii-hero-top" aria-hidden="true">
        <pre className="ascii-hero-bot">{buildBot({ speaking, blink, frame })}</pre>
        <p className="ascii-hero-caption">[ next-token predictor ]</p>
      </div>

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

      <p className="ascii-hero-status" aria-hidden="true">
        <span>T=0.70</span>
        <span>stream: {speaking ? "▮▮▮" : "idle"}</span>
        <span>ctx: 200k</span>
      </p>
    </section>
  );
}
