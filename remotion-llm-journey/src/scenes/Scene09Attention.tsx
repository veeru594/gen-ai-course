import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 09 — THE ATTENTION MECHANISM
   A sentence of tokens sits in a row. One token at a time becomes the
   "query" and fans glowing weighted lines to every other token — that is
   self-attention. The query pointer walks the sentence; line brightness and
   thickness encode the attention weight. Slow and deliberate. */

const TOKENS = ["The", "model", "reads", "every", "word", "at", "once"];

// raw attention affinities (query row → key col); normalised per row below.
const RAW: number[][] = [
  [5, 2, 1, 1, 1, 1, 1],
  [2, 5, 3, 1, 3, 1, 1],
  [1, 4, 5, 2, 4, 1, 1],
  [1, 1, 2, 5, 4, 2, 2],
  [1, 4, 3, 2, 5, 1, 2],
  [1, 1, 1, 2, 2, 5, 3],
  [1, 1, 2, 2, 3, 2, 5],
];
const WEIGHTS = RAW.map((row) => {
  const sum = row.reduce((a, b) => a + b, 0);
  return row.map((v) => v / sum);
});

const TOKEN_Y = 320;
const MARGIN = 280;

export const Scene09Attention: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const n = TOKENS.length;
  const span = 1920 - MARGIN * 2;
  const xs = TOKENS.map((_, i) => MARGIN + (span * i) / (n - 1));

  const intro = 34;
  // walk the query pointer across the sentence, leaving a beat at the end
  const cycleEnd = durationInFrames - 30;
  const perQuery = (cycleEnd - intro) / n;
  const qFloat = (frame - intro) / perQuery;
  const queryIndex = Math.min(n - 1, Math.max(0, Math.floor(qFloat)));
  const localFrame = frame - intro - queryIndex * perQuery;
  const draw = interpolate(localFrame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const active = frame >= intro;

  return (
    <Background>
      <SceneTag index={9} label="Self-attention" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t9-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* attention arcs from the current query token to every key token */}
        {active &&
          xs.map((xk, k) => {
            const w = WEIGHTS[queryIndex][k];
            const xq = xs[queryIndex];
            if (k === queryIndex) {
              // self-attention: a small loop above the token
              const r = 26 + w * 26;
              return (
                <path
                  key={`self-${k}`}
                  d={`M ${xq - 14} ${TOKEN_Y - 26} C ${xq - r} ${TOKEN_Y - 26 - r}, ${xq + r} ${TOKEN_Y - 26 - r}, ${xq + 14} ${TOKEN_Y - 26}`}
                  fill="none"
                  stroke={COLORS.attention}
                  strokeWidth={1 + w * 7}
                  opacity={(0.3 + w) * draw}
                  filter="url(#t9-glow)"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - draw}
                />
              );
            }
            const cx = (xq + xk) / 2;
            const dip = 150 + Math.abs(xk - xq) * 0.34;
            const d = `M ${xq} ${TOKEN_Y + 34} Q ${cx} ${TOKEN_Y + 34 + dip} ${xk} ${TOKEN_Y + 34}`;
            return (
              <path
                key={`arc-${k}`}
                d={d}
                fill="none"
                stroke={COLORS.attention}
                strokeWidth={0.6 + w * 12}
                opacity={(0.12 + w * 1.4) * draw}
                filter="url(#t9-glow)"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
              />
            );
          })}

        {/* the token chips */}
        {TOKENS.map((tok, i) => {
          const reveal = interpolate(frame, [i * 4, i * 4 + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const isQuery = active && i === queryIndex;
          const w = active ? WEIGHTS[queryIndex][i] : 0;
          const boxW = 150;
          const boxH = 70;
          return (
            <g key={tok} opacity={reveal} transform={`translate(${xs[i]} ${TOKEN_Y})`}>
              <rect
                x={-boxW / 2}
                y={-boxH / 2}
                width={boxW}
                height={boxH}
                rx={10}
                fill={isQuery ? COLORS.attention : COLORS.node}
                stroke={isQuery ? COLORS.attention : COLORS.nodeBorder}
                strokeWidth={isQuery ? 2 : 1}
                opacity={isQuery ? 0.22 : 1}
              />
              {/* weight underline for non-query tokens being attended to */}
              {active && !isQuery && (
                <rect
                  x={-boxW / 2}
                  y={boxH / 2 - 5}
                  width={boxW * w * draw}
                  height={5}
                  rx={2.5}
                  fill={COLORS.attention}
                  opacity={0.9}
                />
              )}
              <text
                textAnchor="middle"
                dy={10}
                fontSize={30}
                fontWeight={isQuery ? 700 : 500}
                fill={isQuery ? COLORS.attention : COLORS.text}
              >
                {tok}
              </text>
            </g>
          );
        })}

        {/* labels: which token is currently the query */}
        {active && (
          <text
            x={xs[queryIndex]}
            y={TOKEN_Y - 96}
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize={20}
            fill={COLORS.attention}
            opacity={draw}
          >
            query ↓
          </text>
        )}

        <text
          x={960}
          y={150}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={20}
          fill={COLORS.textDim}
          opacity={interpolate(frame, [20, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          every token weighs every other token · in parallel · ×96 heads
        </text>
      </svg>

      <Caption
        text="Attention"
        sub="each word decides how much every other word matters to it"
        position="bottom"
      />
    </Background>
  );
};
