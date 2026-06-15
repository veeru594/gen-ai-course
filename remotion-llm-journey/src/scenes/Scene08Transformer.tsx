import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 08 — INTO THE TRANSFORMER
   The request descends through a deep stack of layers. We show 96 layers as a
   tall column of thin bars; a bright "activation front" sweeps top-to-bottom,
   lighting each layer's attention + feed-forward sub-blocks as it passes.
   Dense, vertical, mathematical. */

const LAYER_COUNT = 96;
const COLUMN_TOP = 150;
const COLUMN_BOTTOM = 980;
const COLUMN_X = 960;

export const Scene08Transformer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // the stack assembles, then the activation front sweeps down through it
  const assemble = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const sweep = interpolate(frame, [45, durationInFrames - 40], [0, LAYER_COUNT + 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const layerGap = (COLUMN_BOTTOM - COLUMN_TOP) / LAYER_COUNT;

  return (
    <Background>
      <SceneTag index={8} label="Into the transformer" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="t8-frontGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.attention} stopOpacity="0" />
            <stop offset="50%" stopColor={COLORS.attention} stopOpacity="0.55" />
            <stop offset="100%" stopColor={COLORS.attention} stopOpacity="0" />
          </linearGradient>
          <filter id="t8-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* the input token vector entering at the top */}
        <line
          x1={COLUMN_X}
          y1={40}
          x2={COLUMN_X}
          y2={COLUMN_TOP}
          stroke={COLORS.signal}
          strokeWidth={3}
          opacity={interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" })}
        />

        {/* 96 layers */}
        {Array.from({ length: LAYER_COUNT }).map((_, i) => {
          const y = COLUMN_TOP + i * layerGap;
          // distance of the sweeping front from this layer
          const dist = sweep - i;
          const active = dist > 0 && dist < 6;
          const glow = active ? interpolate(dist, [0, 3, 6], [1, 0.6, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) : 0;
          const passed = dist >= 6;
          // bars stagger in as the stack assembles
          const reveal = interpolate(
            assemble,
            [0, 1],
            [0, 1],
          ) * interpolate(i, [0, LAYER_COUNT], [1, 0.4]);
          const halfW = 150 + glow * 90;

          return (
            <g key={i} opacity={Math.min(1, reveal + 0.15)}>
              {/* attention sub-block (left) + feed-forward (right) as one bar */}
              <rect
                x={COLUMN_X - halfW}
                y={y}
                width={halfW * 2}
                height={Math.max(2, layerGap - 1.5)}
                rx={1.5}
                fill={passed ? COLORS.compute : COLORS.node}
                stroke={active ? COLORS.attention : COLORS.nodeBorder}
                strokeWidth={active ? 1.4 : 0.6}
                opacity={passed ? 0.5 : 1}
              />
              {active && (
                <rect
                  x={COLUMN_X - halfW}
                  y={y}
                  width={halfW * 2}
                  height={Math.max(2, layerGap - 1.5)}
                  rx={1.5}
                  fill={COLORS.attention}
                  opacity={glow * 0.8}
                />
              )}
            </g>
          );
        })}

        {/* the bright activation front */}
        {sweep > 0 && sweep < LAYER_COUNT + 4 && (
          <rect
            x={COLUMN_X - 280}
            y={COLUMN_TOP + (sweep - 3) * layerGap}
            width={560}
            height={layerGap * 6}
            fill="url(#t8-frontGlow)"
            filter="url(#t8-soft)"
          />
        )}

        {/* sub-block labels, pinned beside the column */}
        <g
          opacity={interpolate(frame, [30, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          fontFamily="ui-monospace, monospace"
          fontSize={20}
          fill={COLORS.textDim}
        >
          <text x={COLUMN_X - 300} y={COLUMN_TOP - 18} textAnchor="end">
            self-attention
          </text>
          <text x={COLUMN_X + 300} y={COLUMN_TOP - 18} textAnchor="start">
            feed-forward
          </text>
        </g>

        {/* layer-count readout that climbs with the sweep */}
        <text
          x={COLUMN_X + 360}
          y={520}
          fill={COLORS.attention}
          fontFamily="ui-monospace, monospace"
          fontSize={64}
          fontWeight={700}
          opacity={interpolate(frame, [50, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          {String(Math.min(LAYER_COUNT, Math.max(0, Math.floor(sweep)))).padStart(2, "0")}
        </text>
        <text
          x={COLUMN_X + 360}
          y={556}
          fill={COLORS.textFaint}
          fontFamily="ui-monospace, monospace"
          fontSize={22}
          opacity={interpolate(frame, [50, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        >
          / {LAYER_COUNT} layers
        </text>
      </svg>

      <Caption
        text="96 layers deep"
        sub="each one re-reads the entire sentence before passing it on"
        position="bottom"
      />
    </Background>
  );
};
