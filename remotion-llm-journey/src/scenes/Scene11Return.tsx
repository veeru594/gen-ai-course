import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 11 — THE RETURN JOURNEY
   The chosen token races the entire path back in reverse — now in the teal
   response colour — from the GPU cluster to the user's screen, where it lands
   as a single word. Fast and clean: the reverse trip is the easy part. */

const Y = 520;
const STAGES = [
  { label: "your screen", x: 240 },
  { label: "network", x: 620 },
  { label: "cables", x: 1000 },
  { label: "data center", x: 1380 },
  { label: "GPU", x: 1740 },
];
const WORD = "example";

export const Scene11Return: React.FC = () => {
  const frame = useCurrentFrame();

  // token travels from GPU (right) back to the screen (left)
  const travel = interpolate(frame, [8, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fromX = STAGES[STAGES.length - 1].x;
  const toX = STAGES[0].x;
  const tokenX = interpolate(travel, [0, 1], [fromX, toX]);

  const arrived = frame >= 96;
  const letters = Math.floor(
    interpolate(frame, [100, 150], [0, WORD.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <Background>
      <SceneTag index={11} label="The return journey" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t11-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* the path, drawn faint */}
        <line x1={STAGES[0].x} y1={Y} x2={STAGES[STAGES.length - 1].x} y2={Y} stroke={COLORS.nodeBorder} strokeWidth={2} />

        {/* a teal trail behind the token */}
        <line
          x1={tokenX}
          y1={Y}
          x2={fromX}
          y2={Y}
          stroke={COLORS.response}
          strokeWidth={3}
          opacity={0.45}
        />

        {/* stage markers */}
        {STAGES.map((s) => {
          const passed = tokenX <= s.x;
          return (
            <g key={s.label}>
              <circle cx={s.x} cy={Y} r={7} fill={passed ? COLORS.response : COLORS.node} stroke={COLORS.nodeBorder} strokeWidth={1.2} />
              <text x={s.x} y={Y + 44} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={18} fill={COLORS.textDim}>
                {s.label}
              </text>
            </g>
          );
        })}

        {/* the returning token */}
        {!arrived && (
          <g transform={`translate(${tokenX} ${Y})`} filter="url(#t11-glow)">
            <circle r={14} fill={COLORS.response} />
          </g>
        )}

        {/* the screen, where the word lands */}
        <g transform={`translate(${STAGES[0].x} ${Y - 220})`}>
          <rect x={-150} y={-70} width={300} height={150} rx={12} fill={COLORS.node} stroke={arrived ? COLORS.response : COLORS.nodeBorder} strokeWidth={arrived ? 2.4 : 1.4} />
          <text x={0} y={16} textAnchor="middle" fontSize={42} fontWeight={600} fill={COLORS.response}>
            {WORD.slice(0, letters)}
            {arrived && letters < WORD.length ? "▌" : ""}
          </text>
          {/* connector from screen down to the path */}
          <line x1={0} y1={80} x2={0} y2={150} stroke={COLORS.nodeBorder} strokeWidth={2} strokeDasharray="4 6" />
        </g>

        {/* flash when the token lands */}
        {arrived && (
          <circle
            cx={STAGES[0].x}
            cy={Y}
            r={interpolate(frame, [96, 120], [10, 120], { extrapolateRight: "clamp" })}
            fill="none"
            stroke={COLORS.response}
            strokeWidth={interpolate(frame, [96, 120], [4, 0.5], { extrapolateRight: "clamp" })}
            opacity={interpolate(frame, [96, 124], [0.8, 0], { extrapolateRight: "clamp" })}
          />
        )}
      </svg>

      <Caption
        text="…and the word arrives"
        sub="the chosen token retraces the whole path home"
        position="bottom"
      />
    </Background>
  );
};
