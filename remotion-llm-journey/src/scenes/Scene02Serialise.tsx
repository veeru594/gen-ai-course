import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 02 — SERIALISATION
   The keystroke becomes data. A typed prompt collapses into a JSON payload —
   the whole conversation history serialised — printed line by line, then
   compacted into a single packet that flies off toward the network. */

const JSON_LINES = [
  "{",
  '  "model": "claude-opus",',
  '  "messages": [',
  '    { "role": "system", "content": "…" },',
  '    { "role": "user", "content": "explain attention" },',
  '    { "role": "assistant", "content": "…" },',
  '    { "role": "user", "content": "now with an example" }',
  "  ],",
  '  "temperature": 0.7,',
  '  "stream": true',
  "}",
];

export const Scene02Serialise: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // each line types in, staggered
  const perLine = 7;
  // after the JSON is written, it compacts into a packet and shoots away
  const compactStart = JSON_LINES.length * perLine + 18;
  const compact = interpolate(frame, [compactStart, compactStart + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fly = interpolate(frame, [compactStart + 24, durationInFrames - 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panelX = 560;
  const panelY = 240;
  const panelW = 800;
  const lineH = 42;

  return (
    <Background>
      <SceneTag index={2} label="Serialisation" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t2-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* the JSON editor panel, shrinking as it compacts */}
        <g
          transform={`translate(${interpolate(compact, [0, 1], [0, 1320 - panelX]) * fly} 0) scale(${interpolate(compact, [0, 1], [1, 0.04])})`}
          style={{ transformOrigin: `${panelX + panelW / 2}px ${panelY + 240}px` }}
          opacity={interpolate(fly, [0, 0.7, 1], [1, 1, 0])}
        >
          <rect
            x={panelX}
            y={panelY}
            width={panelW}
            height={JSON_LINES.length * lineH + 50}
            rx={12}
            fill={COLORS.node}
            stroke={COLORS.nodeBorder}
            strokeWidth={1.5}
          />
          {JSON_LINES.map((line, i) => {
            const start = i * perLine;
            const chars = Math.floor(
              interpolate(frame, [start, start + perLine], [0, line.length], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            );
            return (
              <text
                key={i}
                x={panelX + 28}
                y={panelY + 48 + i * lineH}
                fontFamily="ui-monospace, monospace"
                fontSize={26}
                fill={i === 4 || i === 6 ? COLORS.signal : COLORS.textDim}
              >
                {line.slice(0, chars)}
              </text>
            );
          })}
        </g>

        {/* the resulting packet flying toward the network */}
        {fly > 0 && (
          <g opacity={interpolate(fly, [0, 0.15], [0, 1], { extrapolateRight: "clamp" })}>
            <rect
              x={interpolate(fly, [0, 1], [960, 1820])}
              y={520}
              width={44}
              height={44}
              rx={8}
              fill={COLORS.signal}
              filter="url(#t2-glow)"
            />
          </g>
        )}
      </svg>

      <Caption
        text="It becomes a packet of text"
        sub="your entire conversation, serialised into JSON"
        position="bottom"
      />
    </Background>
  );
};
