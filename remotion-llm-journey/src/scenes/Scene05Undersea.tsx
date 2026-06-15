import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 05 — UNDERSEA CABLES
   A globe. Fibre-optic cables arc between continents; bright pulses of the
   outbound signal race along them via stroke-dashoffset. The planet drifts in
   slowly, then the light starts moving. */

const CX = 960;
const CY = 520;
const R = 360;

// cable routes as quadratic curves between points near the globe's edge
const CABLES = [
  { x1: 650, y1: 700, cx: 900, cy: 240, x2: 1290, y2: 470, speed: 0.011, pulses: 3 },
  { x1: 700, y1: 760, cx: 1020, cy: 880, x2: 1300, y2: 600, speed: 0.009, pulses: 2 },
  { x1: 640, y1: 560, cx: 960, cy: 360, x2: 1270, y2: 380, speed: 0.013, pulses: 3 },
];

export const Scene05Undersea: React.FC = () => {
  const frame = useCurrentFrame();

  const driftIn = interpolate(frame, [0, 36], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globeOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cablesOn = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Background>
      <SceneTag index={5} label="Undersea cables" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="t5-ocean" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#13314a" />
            <stop offset="60%" stopColor="#0d2236" />
            <stop offset="100%" stopColor="#08131f" />
          </radialGradient>
          <radialGradient id="t5-atmos" cx="50%" cy="50%" r="50%">
            <stop offset="78%" stopColor={COLORS.compute} stopOpacity="0" />
            <stop offset="100%" stopColor={COLORS.compute} stopOpacity="0.35" />
          </radialGradient>
          <clipPath id="t5-globe">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
          <filter id="t5-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <g transform={`translate(0 ${driftIn})`} opacity={globeOpacity}>
          {/* atmosphere halo */}
          <circle cx={CX} cy={CY} r={R + 26} fill="url(#t5-atmos)" />
          {/* ocean sphere */}
          <circle cx={CX} cy={CY} r={R} fill="url(#t5-ocean)" stroke="#1d4b6e" strokeWidth={1.5} />

          {/* meridian + latitude arcs for sphere depth */}
          <g clipPath="url(#t5-globe)" stroke="#1d4b6e" strokeWidth={1} fill="none" opacity={0.5}>
            <ellipse cx={CX} cy={CY} rx={R * 0.45} ry={R} />
            <ellipse cx={CX} cy={CY} rx={R * 0.82} ry={R} />
            <ellipse cx={CX} cy={CY} rx={R} ry={R * 0.45} />
            <ellipse cx={CX} cy={CY} rx={R} ry={R * 0.82} />
            <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} />
          </g>

          {/* faint continents — a few stylised blobs */}
          <g clipPath="url(#t5-globe)" fill="#16384f" opacity={0.85}>
            <path d="M 700 400 q 80 -60 170 -30 q 70 30 40 110 q -40 70 -140 60 q -110 -10 -70 -140 Z" />
            <path d="M 1080 560 q 120 -40 190 40 q 40 80 -40 150 q -120 70 -190 -30 q -40 -90 40 -160 Z" />
            <path d="M 760 660 q 60 -10 90 50 q 20 70 -60 90 q -80 10 -80 -70 q 0 -50 50 -70 Z" />
          </g>

          {/* cables + travelling pulses */}
          <g opacity={cablesOn}>
            {CABLES.map((cable, i) => {
              const d = `M ${cable.x1} ${cable.y1} Q ${cable.cx} ${cable.cy} ${cable.x2} ${cable.y2}`;
              const segLen = 0.055;
              return (
                <g key={i}>
                  {/* the cable itself */}
                  <path d={d} fill="none" stroke="#244a64" strokeWidth={2} />
                  {/* landing-point nodes */}
                  <circle cx={cable.x1} cy={cable.y1} r={6} fill={COLORS.signal} opacity={0.8} />
                  <circle cx={cable.x2} cy={cable.y2} r={6} fill={COLORS.signal} opacity={0.8} />
                  {/* travelling light pulses */}
                  {Array.from({ length: cable.pulses }).map((__, p) => {
                    const offset = p / cable.pulses;
                    const prog = (frame * cable.speed + offset) % 1;
                    return (
                      <path
                        key={p}
                        d={d}
                        fill="none"
                        stroke={COLORS.signal}
                        strokeWidth={4}
                        strokeLinecap="round"
                        pathLength={1}
                        strokeDasharray={`${segLen} ${1 - segLen}`}
                        strokeDashoffset={-prog}
                        filter="url(#t5-glow)"
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      <Caption
        text="Under the oceans, at the speed of light"
        sub="your request crosses continents through fibre on the sea floor"
        position="bottom"
      />
    </Background>
  );
};
