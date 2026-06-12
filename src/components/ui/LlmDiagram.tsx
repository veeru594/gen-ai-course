import { useEffect, useMemo, useRef, useState } from "react";
import { corpus } from "../../data/corpus";
import "./LlmDiagram.css";

/* A real (tiny) language model. Trigram/bigram statistics learned from the
   curriculum's own text, computed in the browser. The diagram animates the
   forward pass; the probabilities on the right are genuine. */

// ---------- model, built once at module load ----------

type Dist = Map<string, number>;

const WORDS = corpus.split(" ");
const BI = new Map<string, Dist>();
const TRI = new Map<string, Dist>();
const UNI: Dist = new Map();

function bump(map: Map<string, Dist>, key: string, next: string) {
  let d = map.get(key);
  if (!d) {
    d = new Map();
    map.set(key, d);
  }
  d.set(next, (d.get(next) ?? 0) + 1);
}

for (let i = 0; i < WORDS.length; i++) {
  UNI.set(WORDS[i], (UNI.get(WORDS[i]) ?? 0) + 1);
  if (i < WORDS.length - 1) {
    bump(BI, WORDS[i], WORDS[i + 1]);
  }
  if (i < WORDS.length - 2) {
    bump(TRI, `${WORDS[i]} ${WORDS[i + 1]}`, WORDS[i + 2]);
  }
}

const FALLBACK: Dist = new Map(
  [...UNI.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50),
);

export type NgramSource = "trigram" | "bigram" | "corpus";

interface Prediction {
  top: Array<{ token: string; p: number }>;
  sampled: string;
  sampledP: number;
  source: NgramSource;
  /** the context words actually used for the lookup */
  context: string;
  /** distinct continuations seen after that context */
  options: number;
  /** how many times the context occurs in the corpus */
  occurrences: number;
}

function predict(tokens: string[]): Prediction {
  const last = tokens[tokens.length - 1];
  const last2 =
    tokens.length > 1 ? `${tokens[tokens.length - 2]} ${last}` : undefined;

  let dist: Dist | undefined;
  let source: NgramSource = "corpus";
  let context = last;
  if (last2) {
    const d = TRI.get(last2);
    if (d && d.size >= 2) {
      dist = d;
      source = "trigram";
      context = last2;
    }
  }
  if (!dist) {
    const d = BI.get(last);
    if (d && d.size >= 1) {
      dist = d;
      source = "bigram";
      context = last;
    }
  }
  if (!dist) {
    dist = FALLBACK;
    source = "corpus";
    context = last;
  }
  const occurrences = [...dist.values()].reduce((s, c) => s + c, 0);
  const options = dist.size;

  // repetition penalty: discourage the loops small n-gram models love
  const recent = new Set(tokens.slice(-4));
  const entries = [...dist.entries()].map(
    ([w, c]) => [w, recent.has(w) ? c * 0.2 : c] as [string, number],
  );
  const total = entries.reduce((s, [, c]) => s + c, 0);
  const sorted = entries
    .map(([token, c]) => ({ token, p: c / total }))
    .sort((a, b) => b.p - a.p);

  let r = Math.random();
  let sampled = sorted[0];
  for (const e of sorted) {
    r -= e.p;
    if (r <= 0) {
      sampled = e;
      break;
    }
  }

  return {
    top: sorted.slice(0, 4),
    sampled: sampled.token,
    sampledP: sampled.p,
    source,
    context,
    options,
    occurrences,
  };
}

function tokenizeSeed(text: string): string[] {
  const toks = text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/\./g, " . ")
    .replace(/[^a-z0-9. ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return toks.length > 0 ? toks : ["automation"];
}

// ---------- diagram geometry ----------

const COL_X = { tokens: 70, emb: 240, l1: 405, l2: 555, l3: 705, out: 845 };
const TOKEN_Y = [125, 185, 245];
const EMB_Y = [80, 120, 160, 200, 240, 280];
const LAYER_Y = [60, 90, 120, 150, 180, 210, 240, 270, 300];
const OUT_Y = [100, 160, 220, 280];
const FEEDBACK_PATH = "M 845 82 C 740 -45, 170 -45, 70 104";

function edgeWeight(i: number, j: number, seed: number): number {
  const n = Math.sin(i * 12.9898 + j * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

function edgesBetween(
  fromX: number,
  fromYs: number[],
  toX: number,
  toYs: number[],
  active: boolean,
  seed: number,
) {
  return fromYs.flatMap((y1, i) =>
    toYs.map((y2, j) => {
      // every edge always carries a weight; weights shimmer while running
      const w = edgeWeight(i, j, seed);
      return (
        <line
          key={`${i}-${j}`}
          x1={fromX}
          y1={y1}
          x2={toX}
          y2={y2}
          className={`lm-edge${active ? " is-active" : ""}`}
          style={{
            strokeWidth: active ? 0.5 + w * 2.2 : 0.3 + w * 1.1,
            opacity: active ? 0.35 + w * 0.65 : 0.14 + w * 0.42,
          }}
        />
      );
    }),
  );
}

function Particles({
  fromX,
  fromYs,
  toX,
  toYs,
}: {
  fromX: number;
  fromYs: number[];
  toX: number;
  toYs: number[];
}) {
  const picks = useMemo(
    () =>
      Array.from({ length: 16 }, (_, k) => ({
        y1: fromYs[Math.floor(Math.random() * fromYs.length)],
        y2: toYs[Math.floor(Math.random() * toYs.length)],
        delay: k * 0.05,
      })),
    // new randoms on every mount; the component is keyed per step
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <>
      {picks.map((p, k) => (
        <circle key={k} r={2.6} opacity={0} className="lm-particle">
          <animate
            attributeName="opacity"
            from="0"
            to="0.95"
            dur="0.01s"
            begin={`${p.delay}s`}
            fill="freeze"
          />
          <animateMotion
            dur="0.85s"
            begin={`${p.delay}s`}
            fill="freeze"
            repeatCount="1"
            path={`M ${fromX} ${p.y1} L ${toX} ${p.y2}`}
          />
        </circle>
      ))}
    </>
  );
}

const PARTICLE_ROUTES: Record<
  number,
  { fromX: number; fromYs: number[]; toX: number; toYs: number[] }
> = {
  1: { fromX: COL_X.tokens + 34, fromYs: TOKEN_Y, toX: COL_X.emb - 7, toYs: EMB_Y },
  2: { fromX: COL_X.emb + 7, fromYs: EMB_Y, toX: COL_X.l1 - 7, toYs: LAYER_Y },
  3: { fromX: COL_X.l1 + 7, fromYs: LAYER_Y, toX: COL_X.l2 - 7, toYs: LAYER_Y },
  4: { fromX: COL_X.l2 + 7, fromYs: LAYER_Y, toX: COL_X.l3 - 7, toYs: LAYER_Y },
  5: { fromX: COL_X.l3 + 7, fromYs: LAYER_Y, toX: COL_X.out - 14, toYs: OUT_Y },
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function chipLabel(t: string): string {
  return t.length > 9 ? `${t.slice(0, 8)}…` : t;
}

// ---------- component ----------

export function LlmDiagram() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [tokens, setTokens] = useState<string[]>(["automation"]);
  const [seedText, setSeedText] = useState("");
  const [step, setStep] = useState(-1);
  const [cycle, setCycle] = useState(0);
  const [tick, setTick] = useState(0);
  const [pred, setPred] = useState<Prediction | null>(null);
  const [reason, setReason] = useState<Prediction | null>(null);
  const [running, setRunning] = useState(false);
  const runId = useRef(0);
  const toksRef = useRef(tokens);

  // weights shimmer while the network is running
  useEffect(() => {
    if (!running || reduced) {
      return;
    }
    const id = window.setInterval(() => setTick((t) => t + 1), 300);
    return () => window.clearInterval(id);
  }, [running, reduced]);

  useEffect(
    () => () => {
      runId.current += 1; // cancel any run on unmount
    },
    [],
  );

  async function runPasses(n: number, fromTokens?: string[]) {
    const id = ++runId.current;
    const alive = () => runId.current === id;
    setRunning(true);
    let toks = fromTokens ?? toksRef.current;
    if (fromTokens) {
      toksRef.current = fromTokens;
      setTokens(fromTokens);
      setPred(null);
    }

    for (let k = 0; k < n; k++) {
      if (!alive()) return;
      setCycle((c) => c + 1);
      // decide up front so the reasoning panel can narrate the pass live
      const res = predict(toks);
      setReason(res);
      if (!reduced) {
        for (let s = 0; s <= 4; s++) {
          setStep(s);
          await sleep(420);
          if (!alive()) return;
        }
      }
      setPred(res);
      setStep(5);
      await sleep(reduced ? 350 : 1500);
      if (!alive()) return;
      toks = [...toks, res.sampled].slice(-60);
      toksRef.current = toks;
      setTokens(toks);
    }
    if (alive()) {
      setStep(-1);
      setRunning(false);
    }
  }

  // come alive on arrival
  useEffect(() => {
    const t = window.setTimeout(() => void runPasses(4), 900);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSeed(e: React.FormEvent) {
    e.preventDefault();
    void runPasses(4, tokenizeSeed(seedText));
  }

  function reset() {
    runId.current += 1;
    setRunning(false);
    setStep(-1);
    setPred(null);
    setSeedText("");
    toksRef.current = ["automation"];
    setTokens(["automation"]);
  }

  const out = step === 5 && pred !== null;
  const route = PARTICLE_ROUTES[step];
  const inputChips = tokens.slice(-3);
  const candidates = pred?.top ?? [];
  const maxP = candidates[0]?.p ?? 1;
  const tape = tokens.join(" ").replace(/ \./g, ".");

  return (
    <figure className="lm-diagram" data-module="foundations">
      <svg
        viewBox="0 -58 960 432"
        role="img"
        aria-label="A working n-gram language model: your input tokens flow through embeddings and transformer layers into a real probability distribution over next tokens; the sampled token is appended and the loop repeats"
      >
        <path d={FEEDBACK_PATH} className={`lm-feedback-arc${out ? " is-on" : ""}`} />
        <text
          x={457}
          y={-30}
          textAnchor="middle"
          className={`lm-feedback-label${out ? " is-on" : ""}`}
        >
          APPEND SAMPLED TOKEN — RUN AGAIN
        </text>

        {edgesBetween(COL_X.tokens + 34, TOKEN_Y, COL_X.emb - 7, EMB_Y, step === 1, cycle * 9 + tick)}
        {edgesBetween(COL_X.emb + 7, EMB_Y, COL_X.l1 - 7, LAYER_Y, step === 2, cycle * 9 + tick + 11)}
        {edgesBetween(COL_X.l1 + 7, LAYER_Y, COL_X.l2 - 7, LAYER_Y, step === 3, cycle * 9 + tick + 23)}
        {edgesBetween(COL_X.l2 + 7, LAYER_Y, COL_X.l3 - 7, LAYER_Y, step === 4, cycle * 9 + tick + 37)}
        {edgesBetween(COL_X.l3 + 7, LAYER_Y, COL_X.out - 14, OUT_Y, out, cycle * 9 + tick + 51)}

        {!reduced && route && <Particles key={`${cycle}-${step}`} {...route} />}

        {/* input tokens — the live tail of the sequence */}
        {inputChips.map((t, i) => (
          <g key={`${tokens.length}-${i}`}>
            <rect
              x={COL_X.tokens - 34}
              y={TOKEN_Y[i] - 14}
              width={68}
              height={28}
              rx={5}
              className={`lm-token${step === 0 ? " is-active" : ""}`}
              style={step === 0 ? { transitionDelay: `${i * 60}ms` } : undefined}
            />
            <text
              x={COL_X.tokens}
              y={TOKEN_Y[i] + 4}
              textAnchor="middle"
              className="lm-token-label"
            >
              {chipLabel(t)}
            </text>
          </g>
        ))}

        {EMB_Y.map((y, i) => (
          <circle
            key={y}
            cx={COL_X.emb}
            cy={y}
            r={7}
            className={`lm-node${step === 1 ? " is-active" : ""}`}
            style={step === 1 ? { animationDelay: `${i * 50}ms` } : undefined}
          />
        ))}

        {[
          { x: COL_X.l1, on: step === 2 },
          { x: COL_X.l2, on: step === 3 },
          { x: COL_X.l3, on: step === 4 },
        ].map(({ x, on }) => (
          <g key={x}>
            <rect
              x={x - 28}
              y={LAYER_Y[0] - 28}
              width={56}
              height={LAYER_Y[LAYER_Y.length - 1] - LAYER_Y[0] + 56}
              rx={10}
              className="lm-layer-box"
            />
            {LAYER_Y.map((y, i) => (
              <circle
                key={y}
                cx={x}
                cy={y}
                r={7}
                className={`lm-node${on ? " is-active" : ""}`}
                style={on ? { animationDelay: `${i * 40}ms` } : undefined}
              />
            ))}
          </g>
        ))}

        {/* real output distribution — stays visible after the pass */}
        {OUT_Y.map((y, i) => {
          const c = candidates[i];
          const isSampled = pred !== null && c?.token === pred.sampled;
          return (
            <g key={y}>
              <text x={COL_X.out} y={y - 10} className={`lm-out-label${isSampled ? " is-top" : ""}`}>
                {c ? chipLabel(c.token) : ""}
              </text>
              <rect
                x={COL_X.out}
                y={y - 4}
                width={c ? Math.max(4, (c.p / maxP) * 105) : 0}
                height={9}
                rx={2}
                className={`lm-out-bar${isSampled ? " is-top" : ""}`}
              />
              <text x={COL_X.out} y={y + 20} className="lm-out-pct">
                {c ? (c.p >= 0.01 ? `${Math.round(c.p * 100)}%` : "<1%") : ""}
              </text>
            </g>
          );
        })}

        {/* the sampled token rides home */}
        {!reduced && out && pred && (
          <g key={cycle} className="lm-feedback-chip" opacity={0}>
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.01s"
              begin="0.35s"
              fill="freeze"
            />
            <animateMotion
              dur="0.75s"
              begin="0.35s"
              fill="freeze"
              repeatCount="1"
              path={FEEDBACK_PATH}
            />
            <rect x={-34} y={-13} width={68} height={26} rx={5} />
            <text y={5} textAnchor="middle">
              {chipLabel(pred.sampled)}
            </text>
          </g>
        )}

        <text x={COL_X.tokens} y={350} textAnchor="middle" className="lm-col-label">
          INPUT TOKENS
        </text>
        <text x={COL_X.emb} y={350} textAnchor="middle" className="lm-col-label">
          EMBEDDINGS
        </text>
        <text x={(COL_X.l1 + COL_X.l3) / 2} y={350} textAnchor="middle" className="lm-col-label">
          TRANSFORMER LAYERS × N — SELF-ATTENTION + FFN
        </text>
        <text x={COL_X.out + 50} y={350} textAnchor="middle" className="lm-col-label">
          OUTPUT DISTRIBUTION
        </text>
      </svg>

      <div className="lm-controls">
        <form className="lm-seed" onSubmit={onSeed}>
          <input
            type="text"
            value={seedText}
            onChange={(e) => setSeedText(e.target.value)}
            placeholder='seed it yourself — try "prompt engineering" or "agents"'
            aria-label="Seed text for the language model"
          />
          <button type="submit" className="lm-btn" disabled={running}>
            seed &amp; run
          </button>
        </form>
        <div className="lm-actions">
          <button
            type="button"
            className="lm-btn is-primary"
            onClick={() => void runPasses(1)}
            disabled={running}
          >
            predict next token
          </button>
          <button
            type="button"
            className="lm-btn"
            onClick={() => void runPasses(8)}
            disabled={running}
          >
            let it write ×8
          </button>
          <button type="button" className="lm-btn" onClick={reset}>
            reset
          </button>
        </div>
      </div>

      <p className="lm-tape" aria-live="polite">
        <span className="lm-tape-label">output ▸ </span>
        {tape}
        <span className="lm-tape-cursor">▌</span>
      </p>

      <figcaption className="lm-caption">
        {pred ? (
          <span className={`lm-sampled${out ? " is-on" : ""}`}>
            sampled “{pred.sampled}” — p={Math.round(pred.sampledP * 100)}%,{" "}
            {pred.source === "corpus"
              ? "word not in the curriculum, backing off to corpus frequencies"
              : `${pred.source} statistics from this curriculum's text`}
          </span>
        ) : (
          <span className="lm-sampled">
            a real language model — {WORDS.length.toLocaleString()} training
            tokens, learned from this curriculum, running in your browser. the
            gap between this and GPT is scale, not kind.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
