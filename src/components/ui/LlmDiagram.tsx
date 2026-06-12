import { useEffect, useState } from "react";
import "./LlmDiagram.css";

/* Animated forward pass: input tokens → embeddings → transformer layers
   → output probability distribution. One pulse per cycle, one token out. */

const TOKENS = ["auto", "ma", "tion"];

const CANDIDATES = [
  { token: "works", p: 0.58 },
  { token: "scales", p: 0.22 },
  { token: "breaks", p: 0.13 },
  { token: "sings", p: 0.07 },
];

// column x positions and node y layouts
const COL_X = { tokens: 70, emb: 240, l1: 405, l2: 555, l3: 705, out: 845 };
const TOKEN_Y = [125, 185, 245];
const EMB_Y = [95, 155, 215, 275];
const LAYER_Y = [70, 116, 162, 208, 254, 300];
const OUT_Y = [110, 165, 220, 275];

// pulse steps: 0 tokens, 1 emb, 2 l1, 3 l2, 4 l3, 5 output
const STEP_HOLD = [650, 650, 650, 650, 650, 2200];

function usePulse(reduced: boolean): number {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) {
      return;
    }
    const t = window.setTimeout(
      () => setStep((s) => (s + 1) % STEP_HOLD.length),
      STEP_HOLD[step],
    );
    return () => window.clearTimeout(t);
  }, [step, reduced]);
  return reduced ? 5 : step;
}

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
}

function Edge({ x1, y1, x2, y2, active }: EdgeProps) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={`lm-edge${active ? " is-active" : ""}`}
    />
  );
}

function edgesBetween(
  fromX: number,
  fromYs: number[],
  toX: number,
  toYs: number[],
  active: boolean,
) {
  return fromYs.flatMap((y1, i) =>
    toYs.map((y2, j) => (
      <Edge
        key={`${i}-${j}`}
        x1={fromX}
        y1={y1}
        x2={toX}
        y2={y2}
        active={active}
      />
    )),
  );
}

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

  const step = usePulse(reduced);
  const out = step === 5;

  return (
    <figure className="lm-diagram" data-module="foundations">
      <svg
        viewBox="0 0 960 370"
        role="img"
        aria-label="Diagram of a language model forward pass: input tokens flow through embeddings and stacked transformer layers into an output probability distribution over candidate next tokens"
      >
        {/* edges, layer by layer — lit when the pulse crosses them */}
        {edgesBetween(COL_X.tokens + 34, TOKEN_Y, COL_X.emb - 9, EMB_Y, step === 1)}
        {edgesBetween(COL_X.emb + 9, EMB_Y, COL_X.l1 - 9, LAYER_Y, step === 2)}
        {edgesBetween(COL_X.l1 + 9, LAYER_Y, COL_X.l2 - 9, LAYER_Y, step === 3)}
        {edgesBetween(COL_X.l2 + 9, LAYER_Y, COL_X.l3 - 9, LAYER_Y, step === 4)}
        {edgesBetween(COL_X.l3 + 9, LAYER_Y, COL_X.out - 14, OUT_Y, out)}

        {/* input tokens */}
        {TOKENS.map((t, i) => (
          <g key={t}>
            <rect
              x={COL_X.tokens - 34}
              y={TOKEN_Y[i] - 14}
              width={68}
              height={28}
              rx={5}
              className={`lm-token${step === 0 ? " is-active" : ""}`}
            />
            <text x={COL_X.tokens} y={TOKEN_Y[i] + 4} textAnchor="middle" className="lm-token-label">
              {t}
            </text>
          </g>
        ))}

        {/* embeddings */}
        {EMB_Y.map((y) => (
          <circle
            key={y}
            cx={COL_X.emb}
            cy={y}
            r={9}
            className={`lm-node${step === 1 ? " is-active" : ""}`}
          />
        ))}

        {/* transformer layers */}
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
            {LAYER_Y.map((y) => (
              <circle
                key={y}
                cx={x}
                cy={y}
                r={9}
                className={`lm-node${on ? " is-active" : ""}`}
              />
            ))}
          </g>
        ))}

        {/* output distribution */}
        {CANDIDATES.map((c, i) => (
          <g key={c.token}>
            <text
              x={COL_X.out}
              y={OUT_Y[i] - 10}
              className={`lm-out-label${out && i === 0 ? " is-top" : ""}`}
            >
              {c.token}
            </text>
            <rect
              x={COL_X.out}
              y={OUT_Y[i] - 4}
              width={out ? c.p * 110 : 3}
              height={9}
              rx={2}
              className={`lm-out-bar${out && i === 0 ? " is-top" : ""}`}
            />
            <text x={COL_X.out} y={OUT_Y[i] + 20} className="lm-out-pct">
              {out ? `${Math.round(c.p * 100)}%` : "—"}
            </text>
          </g>
        ))}

        {/* column labels */}
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

      <figcaption className="lm-caption">
        <span className={`lm-sampled${out ? " is-on" : ""}`} aria-live="polite">
          {out ? 'sampled → "works"' : "forward pass running…"}
        </span>
      </figcaption>
    </figure>
  );
}
