import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 06 — THE DATA CENTER
   The packet arrives and passes three gates in sequence: authentication,
   rate limiting, routing. Each gate checks the packet, flips to a green tick,
   and passes it on toward the compute cluster. */

const GATES = [
  { label: "authenticate", sub: "valid API key?" },
  { label: "rate limit", sub: "within quota?" },
  { label: "route", sub: "to a free cluster" },
];

const Y = 540;
const GATE_X = [620, 960, 1300];

export const Scene06DataCenter: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // packet enters from the left and advances gate to gate
  const perGate = 42;
  const start = 16;
  const packetStop = GATE_X.map((_, i) => start + i * perGate + 24);

  // current packet x: travels between gates
  let packetX = 200;
  for (let i = 0; i < GATE_X.length; i++) {
    const segStart = start + i * perGate;
    const arrive = packetStop[i];
    const prevX = i === 0 ? 200 : GATE_X[i - 1];
    packetX = interpolate(frame, [segStart, arrive], [prevX, GATE_X[i]], {
      extrapolateLeft: i === 0 ? "clamp" : "extend",
      extrapolateRight: "clamp",
    });
    if (frame < arrive) break;
  }
  // final exit toward the cluster
  const exit = interpolate(frame, [packetStop[2] + 16, durationInFrames - 6], [GATE_X[2], 1860], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame > packetStop[2] + 16) packetX = exit;

  return (
    <Background>
      <SceneTag index={6} label="The data center" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t6-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* track line */}
        <line x1={120} y1={Y} x2={1860} y2={Y} stroke={COLORS.nodeBorder} strokeWidth={2} strokeDasharray="2 8" />

        {/* the three gates */}
        {GATES.map((gate, i) => {
          const cleared = frame >= packetStop[i];
          const reveal = interpolate(frame, [i * 6, i * 6 + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const checking = frame >= packetStop[i] - 18 && frame < packetStop[i];
          return (
            <g key={i} opacity={reveal} transform={`translate(${GATE_X[i]} ${Y})`}>
              <rect
                x={-100}
                y={-90}
                width={200}
                height={180}
                rx={14}
                fill={COLORS.node}
                stroke={cleared ? COLORS.response : checking ? COLORS.signal : COLORS.nodeBorder}
                strokeWidth={cleared || checking ? 2.4 : 1.2}
              />
              <text x={0} y={-36} textAnchor="middle" fontSize={26} fontWeight={600} fill={cleared ? COLORS.response : COLORS.text}>
                {gate.label}
              </text>
              <text x={0} y={-6} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={17} fill={COLORS.textDim}>
                {gate.sub}
              </text>
              {/* status: spinner-ish dot while checking, tick when cleared */}
              {cleared ? (
                <path d="M -16 36 l 12 12 l 22 -28" fill="none" stroke={COLORS.response} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" filter="url(#t6-glow)" />
              ) : (
                <circle cx={0} cy={44} r={8} fill={checking ? COLORS.signal : COLORS.nodeBorder} opacity={checking ? 0.6 + 0.4 * Math.sin(frame * 0.6) : 0.5} />
              )}
            </g>
          );
        })}

        {/* compute cluster waiting at the exit */}
        <g opacity={interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={1700 + (i % 3) * 26} y={Y - 38 + Math.floor(i / 3) * 26} width={20} height={20} rx={3} fill={COLORS.compute} opacity={0.35} />
          ))}
          <text x={1738} y={Y + 70} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={16} fill={COLORS.textFaint}>
            cluster
          </text>
        </g>

        {/* the packet */}
        <rect x={packetX - 16} y={Y - 16} width={32} height={32} rx={6} fill={COLORS.signal} filter="url(#t6-glow)" />
      </svg>

      <Caption
        text="It checks in at the data center"
        sub="authenticated, rate-limited, routed — in milliseconds"
        position="bottom"
      />
    </Background>
  );
};
