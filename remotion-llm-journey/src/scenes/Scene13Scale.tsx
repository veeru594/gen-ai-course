import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../Root";
import { Background, envelope } from "./_shared";

/* SCENE 13 — SCALE REVEAL
   The climax. One round trip becomes 500. The camera pulls back to reveal a
   field of 500 journeys — every one of them the entire trip you just watched —
   for a single reply. */

const COLS = 25;
const ROWS = 20;
const TOTAL = COLS * ROWS; // 500

export const Scene13Scale: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // pull-back: the field starts zoomed in and scales out to reveal all 500
  const zoom = interpolate(frame, [20, 110], [2.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fieldOpacity = interpolate(frame, [16, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // the counter races up to 500
  const count = Math.round(
    interpolate(frame, [24, 130], [1, TOTAL], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const gridW = 1280;
  const gridH = 620;
  const cellW = gridW / COLS;
  const cellH = gridH / ROWS;
  const originX = (1920 - gridW) / 2;
  const originY = 250;

  const finale = interpolate(frame, [134, 152], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Background>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t13-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* the field of 500 journeys */}
        <g
          opacity={fieldOpacity}
          transform={`translate(960 ${originY + gridH / 2}) scale(${zoom}) translate(${-960} ${-(originY + gridH / 2)})`}
        >
          {Array.from({ length: TOTAL }).map((_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const cx = originX + col * cellW + cellW / 2;
            const cy = originY + row * cellH + cellH / 2;
            const lit = i < count;
            // alternate the two journey colours so the field shimmers
            const color = i % 2 === 0 ? COLORS.signal : COLORS.response;
            const justLit = i < count && i > count - 12;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={justLit ? 7 : 5}
                fill={lit ? color : COLORS.node}
                stroke={lit ? "none" : COLORS.nodeBorder}
                strokeWidth={0.6}
                opacity={lit ? (justLit ? 1 : 0.6) : 0.5}
                filter={justLit ? "url(#t13-glow)" : undefined}
              />
            );
          })}
        </g>

        {/* the big counter, fading out as the finale text takes over */}
        <text
          x={960}
          y={150}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={120}
          fontWeight={700}
          fill={COLORS.text}
          opacity={interpolate(finale, [0, 1], [1, 0.15])}
        >
          {count}
        </text>
        <text
          x={960}
          y={205}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={24}
          fill={COLORS.textDim}
          opacity={interpolate(finale, [0, 1], [1, 0.15])}
        >
          complete round trips
        </text>
      </svg>

      {/* finale line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 120,
          textAlign: "center",
          opacity: finale * envelope(frame, durationInFrames, 1, 8),
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, color: COLORS.text }}>
          A 500-word reply is 500 of these journeys.
        </div>
        <div style={{ fontSize: 28, fontWeight: 400, color: COLORS.textDim, marginTop: 16 }}>
          All of that — between you pressing Enter and reading a sentence.
        </div>
      </div>
    </Background>
  );
};
