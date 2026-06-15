import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 10 — LOGITS & SAMPLING
   The final layer emits a probability distribution over the vocabulary. Bars
   settle into place; the count "100,000 tokens" ticks up. Then temperature +
   sampling slows everything down and selects ONE token. A moment of decision. */

// the visible top candidates (the rest are summarised as "+99,9xx more")
const CANDIDATES = [
  { tok: "example", p: 0.34 },
  { tok: "instance", p: 0.19 },
  { tok: "case", p: 0.12 },
  { tok: "sentence", p: 0.08 },
  { tok: "way", p: 0.06 },
  { tok: "demo", p: 0.04 },
  { tok: "picture", p: 0.03 },
];

export const Scene10Logits: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const barsIn = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vocabCount = Math.round(
    interpolate(frame, [20, 90], [0, 100000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  // the decision: a selector sweeps, slows, and locks on the winner (index 0)
  const decide = interpolate(frame, [150, durationInFrames - 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chosen = decide >= 1;
  const chosenIndex = 0;

  const baseX = 560;
  const baseY = 760;
  const barW = 150;
  const gap = 24;
  const maxH = 460;

  return (
    <Background>
      <SceneTag index={10} label="Logits & sampling" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t10-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* baseline */}
        <line x1={baseX - 30} y1={baseY} x2={baseX + CANDIDATES.length * (barW + gap)} y2={baseY} stroke={COLORS.nodeBorder} strokeWidth={2} />

        {CANDIDATES.map((c, i) => {
          const x = baseX + i * (barW + gap);
          const h = c.p * maxH * barsIn;
          const isWinner = i === chosenIndex;
          const dim = chosen && !isWinner;
          return (
            <g key={c.tok} opacity={dim ? interpolate(decide, [0.6, 1], [1, 0.25], { extrapolateLeft: "clamp" }) : 1}>
              <rect
                x={x}
                y={baseY - h}
                width={barW}
                height={h}
                rx={6}
                fill={isWinner && chosen ? COLORS.signal : COLORS.compute}
                opacity={isWinner && chosen ? 1 : 0.55}
                filter={isWinner && chosen ? "url(#t10-glow)" : undefined}
              />
              <text x={x + barW / 2} y={baseY + 34} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={22} fill={isWinner && chosen ? COLORS.signal : COLORS.text}>
                {c.tok}
              </text>
              <text x={x + barW / 2} y={baseY - h - 14} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={18} fill={COLORS.textDim}>
                {(c.p * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}

        {/* the rest of the vocabulary */}
        <text
          x={baseX + CANDIDATES.length * (barW + gap) + 30}
          y={baseY - 20}
          fontFamily="ui-monospace, monospace"
          fontSize={20}
          fill={COLORS.textFaint}
          opacity={barsIn}
        >
          + {(99993).toLocaleString()} more…
        </text>

        {/* vocabulary size readout */}
        <text x={960} y={210} textAnchor="middle" fontSize={30} fontWeight={600} fill={COLORS.text}>
          a probability for every token
        </text>
        <text x={960} y={262} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={44} fill={COLORS.compute}>
          {vocabCount.toLocaleString()}
        </text>

        {/* the selector pointer that locks onto the winner */}
        {frame >= 150 && (
          <g
            transform={`translate(${baseX + chosenIndex * (barW + gap) + barW / 2} ${baseY + 70})`}
            opacity={interpolate(decide, [0, 0.2], [0, 1], { extrapolateRight: "clamp" })}
          >
            <path d="M 0 30 l -16 26 l 32 0 Z" fill={COLORS.signal} />
            <text x={0} y={92} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={20} fill={COLORS.signal}>
              {chosen ? "sampled" : "sampling…"}
            </text>
          </g>
        )}

        <text x={960} y={140} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={20} fill={COLORS.textDim}>
          temperature 0.7 · one token is chosen
        </text>
      </svg>

      <Caption
        text="One token is chosen"
        sub="out of a hundred thousand — weighted by probability"
        position="bottom"
      />
    </Background>
  );
};
