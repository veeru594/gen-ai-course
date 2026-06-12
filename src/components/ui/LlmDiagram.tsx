import { useEffect, useMemo, useState } from "react";
import "./LlmDiagram.css";

/* Animated forward pass: input tokens → embeddings → transformer layers
   → output distribution → sampled token fed back to the input.
   Edge strengths reshuffle every cycle — attention is different each pass. */

const TOKENS = ["auto", "ma", "tion"];

const CANDIDATES = [
  { token: "works", p: 0.58 },
  { token: "scales", p: 0.22 },
  { token: "breaks", p: 0.13 },
  { token: "sings", p: 0.07 },
];

const COL_X = { tokens: 70, emb: 240, l1: 405, l2: 555, l3: 705, out: 845 };
const TOKEN_Y = [125, 185, 245];
const EMB_Y = [95, 155, 215, 275];
const LAYER_Y = [70, 116, 162, 208, 254, 300];
const OUT_Y = [110, 165, 220, 275];

// pulse steps: 0 tokens, 1 emb, 2 l1, 3 l2, 4 l3, 5 output + feedback
const STEP_HOLD = [600, 600, 600, 600, 600, 2600];

function usePulse(reduced: boolean): { step: number; cycle: number } {
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (reduced) {
      return;
    }
    const t = window.setTimeout(() => {
      setStep((s) => {
        if (s === STEP_HOLD.length - 1) {
          setCycle((c) => c + 1);
          return 0;
        }
        return s + 1;
      });
    }, STEP_HOLD[step]);
    return () => window.clearTimeout(t);
  }, [step, reduced]);
  return reduced ? { step: 5, cycle: 0 } : { step, cycle };
}

/** cheap deterministic pseudo-random in [0,1) from edge indices + cycle */
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
      const w = edgeWeight(i, j, seed);
      return (
        <line
          key={`${i}-${j}`}
          x1={fromX}
          y1={y1}
          x2={toX}
          y2={y2}
          className={`lm-edge${active ? " is-active" : ""}`}
          style={
            active
              ? { strokeWidth: 0.5 + w * 2.1, opacity: 0.3 + w * 0.7 }
              : undefined
          }
        />
      );
    }),
  );
}

interface ParticleSpec {
  y1: number;
  y2: number;
  delay: number;
}

/** sparks that travel the wires of the currently-active transition */
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
  const picks = useMemo<ParticleSpec[]>(
    () =>
      Array.from({ length: 12 }, (_, k) => ({
        y1: fromYs[Math.floor(Math.random() * fromYs.length)],
        y2: toYs[Math.floor(Math.random() * toYs.length)],
        delay: k * 0.035,
      })),
    // new randoms on every mount; the component is keyed by step
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
            dur="0.5s"
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
  1: { fromX: COL_X.tokens + 34, fromYs: TOKEN_Y, toX: COL_X.emb - 9, toYs: EMB_Y },
  2: { fromX: COL_X.emb + 9, fromYs: EMB_Y, toX: COL_X.l1 - 9, toYs: LAYER_Y },
  3: { fromX: COL_X.l1 + 9, fromYs: LAYER_Y, toX: COL_X.l2 - 9, toYs: LAYER_Y },
  4: { fromX: COL_X.l2 + 9, fromYs: LAYER_Y, toX: COL_X.l3 - 9, toYs: LAYER_Y },
  5: { fromX: COL_X.l3 + 9, fromYs: LAYER_Y, toX: COL_X.out - 14, toYs: OUT_Y },
};

const FEEDBACK_PATH = "M 845 92 C 740 -45, 170 -45, 70 104";

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

  const { step, cycle } = usePulse(reduced);
  const out = step === 5;
  const route = PARTICLE_ROUTES[step];

  return (
    <figure className="lm-diagram" data-module="foundations">
      <svg
        viewBox="0 -58 960 432"
        role="img"
        aria-label="Diagram of a language model forward pass: input tokens flow through embeddings and stacked transformer layers into an output probability distribution; the sampled token is appended back onto the input and the loop repeats"
      >
        {/* feedback arc — the autoregressive loop */}
        <path
          d={FEEDBACK_PATH}
          className={`lm-feedback-arc${out ? " is-on" : ""}`}
        />
        <text x={457} y={-30} textAnchor="middle" className={`lm-feedback-label${out ? " is-on" : ""}`}>
          APPEND SAMPLED TOKEN — RUN AGAIN
        </text>

        {/* edges, weights reshuffled per cycle */}
        {edgesBetween(COL_X.tokens + 34, TOKEN_Y, COL_X.emb - 9, EMB_Y, step === 1, cycle)}
        {edgesBetween(COL_X.emb + 9, EMB_Y, COL_X.l1 - 9, LAYER_Y, step === 2, cycle + 11)}
        {edgesBetween(COL_X.l1 + 9, LAYER_Y, COL_X.l2 - 9, LAYER_Y, step === 3, cycle + 23)}
        {edgesBetween(COL_X.l2 + 9, LAYER_Y, COL_X.l3 - 9, LAYER_Y, step === 4, cycle + 37)}
        {edgesBetween(COL_X.l3 + 9, LAYER_Y, COL_X.out - 14, OUT_Y, out, cycle + 51)}

        {/* travelling sparks on the active transition */}
        {!reduced && route && <Particles key={`${cycle}-${step}`} {...route} />}

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
              style={step === 0 ? { transitionDelay: `${i * 60}ms` } : undefined}
            />
            <text x={COL_X.tokens} y={TOKEN_Y[i] + 4} textAnchor="middle" className="lm-token-label">
              {t}
            </text>
          </g>
        ))}

        {/* embeddings */}
        {EMB_Y.map((y, i) => (
          <circle
            key={y}
            cx={COL_X.emb}
            cy={y}
            r={9}
            className={`lm-node${step === 1 ? " is-active" : ""}`}
            style={step === 1 ? { animationDelay: `${i * 50}ms` } : undefined}
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
            {LAYER_Y.map((y, i) => (
              <circle
                key={y}
                cx={x}
                cy={y}
                r={9}
                className={`lm-node${on ? " is-active" : ""}`}
                style={on ? { animationDelay: `${i * 45}ms` } : undefined}
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

        {/* the sampled token riding the feedback arc home */}
        {!reduced && out && (
          <g key={cycle} className="lm-feedback-chip" opacity={0}>
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.01s"
              begin="0.7s"
              fill="freeze"
            />
            <animateMotion
              dur="1.3s"
              begin="0.7s"
              fill="freeze"
              repeatCount="1"
              path={FEEDBACK_PATH}
            />
            <rect x={-32} y={-13} width={64} height={26} rx={5} />
            <text y={5} textAnchor="middle">works</text>
          </g>
        )}

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
          {out
            ? 'sampled → "works" — appended to the input, and the loop runs again'
            : `forward pass running… attention pattern #${cycle + 1}`}
        </span>
      </figcaption>
    </figure>
  );
}
