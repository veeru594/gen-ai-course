import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 07 — THE GPU CLUSTER
   A wall of H100s. A dense grid of compute tiles powers on in a wave; then the
   context window "loads into VRAM" as a bright bar filling across the rack.
   Electric-blue compute glow. */

const COLS = 24;
const ROWS = 12;
const GRID_X = 360;
const GRID_Y = 210;
const CELL = 52;
const GAP = 8;

export const Scene07GPU: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // diagonal power-on wave across the rack
  const wave = interpolate(frame, [10, 120], [0, COLS + ROWS + 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // VRAM load bar sweeps left→right in the second half
  const vram = interpolate(frame, [130, durationInFrames - 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gridW = COLS * (CELL + GAP) - GAP;

  return (
    <Background>
      <SceneTag index={7} label="GPU cluster" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t7-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* rack frame */}
        <rect
          x={GRID_X - 28}
          y={GRID_Y - 28}
          width={gridW + 56}
          height={ROWS * (CELL + GAP) - GAP + 56}
          rx={14}
          fill={COLORS.bgSoft}
          stroke={COLORS.nodeBorder}
          strokeWidth={1.5}
        />

        {/* compute tiles */}
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((__, c) => {
            const x = GRID_X + c * (CELL + GAP);
            const y = GRID_Y + r * (CELL + GAP);
            const diag = c + r;
            const on = wave - diag;
            const lit = interpolate(on, [0, 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            // subtle independent flicker once powered
            const flicker =
              lit > 0.9
                ? 0.7 + 0.3 * Math.sin((frame + diag * 9) * 0.5)
                : lit;
            // VRAM fill highlights a column band as it passes
            const colFrac = c / (COLS - 1);
            const inVram = vram > colFrac && vram - colFrac < 0.12;
            return (
              <rect
                key={`${r}-${c}`}
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={6}
                fill={lit > 0.05 ? COLORS.compute : COLORS.node}
                stroke={inVram ? COLORS.text : COLORS.nodeBorder}
                strokeWidth={inVram ? 1.6 : 0.6}
                opacity={lit > 0.05 ? 0.18 + flicker * 0.7 : 1}
              />
            );
          }),
        )}

        {/* VRAM load progress label */}
        <g
          opacity={interpolate(frame, [125, 145], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          <text
            x={GRID_X}
            y={GRID_Y + ROWS * (CELL + GAP) + 60}
            fontFamily="ui-monospace, monospace"
            fontSize={22}
            fill={COLORS.compute}
          >
            loading context window → VRAM
          </text>
          <text
            x={GRID_X + gridW}
            y={GRID_Y + ROWS * (CELL + GAP) + 60}
            textAnchor="end"
            fontFamily="ui-monospace, monospace"
            fontSize={22}
            fill={COLORS.text}
          >
            {Math.round(vram * 100)}%
          </text>
          <rect
            x={GRID_X}
            y={GRID_Y + ROWS * (CELL + GAP) + 76}
            width={gridW}
            height={6}
            rx={3}
            fill={COLORS.node}
          />
          <rect
            x={GRID_X}
            y={GRID_Y + ROWS * (CELL + GAP) + 76}
            width={gridW * vram}
            height={6}
            rx={3}
            fill={COLORS.compute}
            filter="url(#t7-glow)"
          />
        </g>

        <text
          x={960}
          y={GRID_Y - 70}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={22}
          fill={COLORS.textDim}
          opacity={interpolate(frame, [20, 45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          {COLS * ROWS}+ accelerators · NVIDIA H100
        </text>
      </svg>

      <Caption
        text="A cluster of GPUs wakes up"
        sub="thousands of H100s — your conversation now lives in their memory"
        position="bottom"
      />
    </Background>
  );
};
