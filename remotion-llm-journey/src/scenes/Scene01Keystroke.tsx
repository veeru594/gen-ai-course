import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 01 — THE KEYSTROKE
   A single Enter key. It presses down, and a ring of signal pulses outward
   from the moment of contact. The whole journey begins from this one press. */

export const Scene01Keystroke: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // the key travels down around frame 22, then releases
  const pressIn = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 200 } });
  const release = spring({ frame: frame - 40, fps, config: { damping: 14, stiffness: 200 } });
  const depth = interpolate(pressIn - release, [0, 1], [0, 10]);

  const pressFrame = 24;
  const ring = interpolate(frame, [pressFrame, durationInFrames - 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(frame, [pressFrame, pressFrame + 6, durationInFrames - 10], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const keyW = 280;
  const keyH = 150;
  const cx = 960;
  const cy = 540;

  return (
    <Background>
      <SceneTag index={1} label="The keystroke" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t1-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* signal ring expanding from the contact point */}
        {frame >= pressFrame && (
          <circle
            cx={cx}
            cy={cy + depth}
            r={ring * 520}
            fill="none"
            stroke={COLORS.signal}
            strokeWidth={interpolate(ring, [0, 1], [6, 1])}
            opacity={ringOpacity}
            filter="url(#t1-glow)"
          />
        )}

        {/* key shadow / well — soft drop shadow on the paper */}
        <rect
          x={cx - keyW / 2}
          y={cy - keyH / 2 + 14}
          width={keyW}
          height={keyH}
          rx={16}
          fill={COLORS.text}
          opacity={0.12}
        />

        {/* the key cap */}
        <g transform={`translate(0 ${depth})`}>
          <rect
            x={cx - keyW / 2}
            y={cy - keyH / 2}
            width={keyW}
            height={keyH}
            rx={16}
            fill={COLORS.node}
            stroke={frame >= pressFrame ? COLORS.signal : COLORS.nodeBorder}
            strokeWidth={frame >= pressFrame ? 2 : 1.5}
          />
          <text
            x={cx}
            y={cy + 16}
            textAnchor="middle"
            fontSize={52}
            fontWeight={600}
            fill={frame >= pressFrame ? COLORS.signal : COLORS.text}
          >
            ⏎ Enter
          </text>
        </g>
      </svg>

      <Caption text="You press Enter" position="bottom" />
    </Background>
  );
};
