import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 04 — THROUGH THE NETWORK
   The packet hops router → ISP → internet backbone. A chain of nodes lights up
   as the signal flows through; a mobile branch (cell tower) feeds in at the
   start. Continuous pulses on every edge sell "traffic in motion". */

const Y = 560;
const NODES = [
  { label: "router", x: 280 },
  { label: "ISP", x: 620 },
  { label: "backbone", x: 980 },
  { label: "IXP", x: 1320 },
  { label: "backbone", x: 1660 },
];

export const Scene04Network: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // packet glides across the whole chain
  const prog = interpolate(frame, [20, durationInFrames - 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const packetX = interpolate(prog, [0, 1], [NODES[0].x, NODES[NODES.length - 1].x]);

  // mobile branch fades in then out early
  const mobile = interpolate(frame, [10, 30, 80, 105], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Background>
      <SceneTag index={4} label="Through the network" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t4-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* mobile cell-tower branch into the router */}
        <g opacity={mobile}>
          <line x1={NODES[0].x} y1={300} x2={NODES[0].x} y2={Y - 50} stroke={COLORS.nodeBorder} strokeWidth={2} strokeDasharray="6 6" />
          <path d="M -22 0 L 0 -54 L 22 0 Z" transform={`translate(${NODES[0].x} 320)`} fill="none" stroke={COLORS.signal} strokeWidth={2.5} />
          {[0, 1, 2].map((i) => {
            const wp = (frame * 0.05 + i * 0.33) % 1;
            return (
              <circle key={i} cx={NODES[0].x} cy={280} r={20 + wp * 50} fill="none" stroke={COLORS.signal} strokeWidth={2} opacity={(1 - wp) * 0.6} />
            );
          })}
          <text x={NODES[0].x} y={250} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={18} fill={COLORS.signal}>
            if mobile: cell tower first
          </text>
        </g>

        {/* edges with continuous flowing pulses */}
        {NODES.slice(0, -1).map((node, i) => {
          const next = NODES[i + 1];
          const d = `M ${node.x} ${Y} L ${next.x} ${Y}`;
          return (
            <g key={i}>
              <line x1={node.x} y1={Y} x2={next.x} y2={Y} stroke={COLORS.nodeBorder} strokeWidth={2} />
              {[0, 1].map((p) => {
                const seg = 0.12;
                const prg = (frame * 0.02 + p * 0.5 + i * 0.13) % 1;
                return (
                  <path
                    key={p}
                    d={d}
                    fill="none"
                    stroke={COLORS.signal}
                    strokeWidth={3}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={`${seg} ${1 - seg}`}
                    strokeDashoffset={-prg}
                    opacity={0.55}
                  />
                );
              })}
            </g>
          );
        })}

        {/* nodes — highlight as the packet passes */}
        {NODES.map((node, i) => {
          const near = Math.abs(packetX - node.x) < 90;
          const reveal = interpolate(frame, [i * 6, i * 6 + 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={i} opacity={reveal}>
              <rect
                x={node.x - 70}
                y={Y - 44}
                width={140}
                height={88}
                rx={10}
                fill={COLORS.node}
                stroke={near ? COLORS.signal : COLORS.nodeBorder}
                strokeWidth={near ? 2.4 : 1.2}
              />
              <text x={node.x} y={Y + 6} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={20} fill={near ? COLORS.signal : COLORS.text}>
                {node.label}
              </text>
            </g>
          );
        })}

        {/* the packet itself */}
        <rect x={packetX - 16} y={Y - 16} width={32} height={32} rx={6} fill={COLORS.signal} filter="url(#t4-glow)" />

        {/* trailing arrow toward the data center */}
        <text
          x={1760}
          y={Y + 6}
          textAnchor="middle"
          fontSize={40}
          fill={COLORS.textFaint}
          opacity={interpolate(prog, [0.7, 1], [0, 1], { extrapolateLeft: "clamp" })}
        >
          →
        </text>
      </svg>

      <Caption
        text="Into the backbone of the internet"
        sub="router to ISP to the high-capacity core — hop after hop"
        position="bottom"
      />
    </Background>
  );
};
