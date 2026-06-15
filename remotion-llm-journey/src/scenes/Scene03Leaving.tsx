import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 03 — LEAVING THE DEVICE
   Before a single byte leaves, a TLS handshake locks the channel. Then the
   encrypted packet rides WiFi from the laptop to the router. */

const LAPTOP_X = 470;
const ROUTER_X = 1420;
const Y = 560;

export const Scene03Leaving: React.FC = () => {
  const frame = useCurrentFrame();

  // phase 1: handshake (0–54), phase 2: lock (54–66), phase 3: travel (66+)
  const handshake = interpolate(frame, [6, 54], [0, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lock = interpolate(frame, [54, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const travel = interpolate(frame, [72, 142], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const packetX = interpolate(travel, [0, 1], [LAPTOP_X + 60, ROUTER_X - 60]);

  return (
    <Background>
      <SceneTag index={3} label="Leaving the device" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t3-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* laptop */}
        <g>
          <rect x={LAPTOP_X - 110} y={Y - 80} width={220} height={140} rx={10} fill={COLORS.node} stroke={COLORS.nodeBorder} strokeWidth={3} />
          <rect x={LAPTOP_X - 140} y={Y + 60} width={280} height={16} rx={6} fill={COLORS.nodeBorder} />
          <text x={LAPTOP_X} y={Y - 100} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={20} fill={COLORS.textDim}>
            your device
          </text>
        </g>

        {/* router with wifi waves */}
        <g>
          <rect x={ROUTER_X - 70} y={Y - 40} width={140} height={90} rx={10} fill={COLORS.node} stroke={COLORS.nodeBorder} strokeWidth={3} />
          <line x1={ROUTER_X - 30} y1={Y - 40} x2={ROUTER_X - 45} y2={Y - 90} stroke={COLORS.nodeBorder} strokeWidth={4} />
          <line x1={ROUTER_X + 30} y1={Y - 40} x2={ROUTER_X + 45} y2={Y - 90} stroke={COLORS.nodeBorder} strokeWidth={4} />
          <text x={ROUTER_X} y={Y + 90} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={20} fill={COLORS.textDim}>
            router
          </text>
        </g>

        {/* TLS handshake messages */}
        {[0, 1, 2].map((m) => {
          const local = handshake - m;
          const vis = local > 0 && local < 1.4;
          if (!vis) return null;
          const goingRight = m !== 1; // middle message returns
          const p = Math.min(1, local);
          const x = goingRight
            ? interpolate(p, [0, 1], [LAPTOP_X + 60, ROUTER_X - 60])
            : interpolate(p, [0, 1], [ROUTER_X - 60, LAPTOP_X + 60]);
          const labels = ["ClientHello", "ServerHello + cert", "key exchange"];
          return (
            <g key={m}>
              <circle cx={x} cy={Y} r={9} fill={COLORS.signal} filter="url(#t3-glow)" />
              <text x={x} y={Y - 26} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={18} fill={COLORS.signal} opacity={interpolate(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0])}>
                {labels[m]}
              </text>
            </g>
          );
        })}

        {/* "TLS" channel label */}
        <text
          x={(LAPTOP_X + ROUTER_X) / 2}
          y={Y + 150}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize={22}
          fill={COLORS.textDim}
          opacity={interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        >
          TLS handshake — encrypt before anything leaves
        </text>

        {/* padlock snapping shut */}
        {lock > 0 && (
          <g
            transform={`translate(${(LAPTOP_X + ROUTER_X) / 2} ${Y - 150})`}
            opacity={travel > 0.05 ? interpolate(travel, [0.05, 0.3], [1, 0]) : lock}
          >
            <rect x={-26} y={-6} width={52} height={44} rx={8} fill={COLORS.signal} opacity={0.9} />
            <path
              d={`M -16 -6 v -14 a 16 16 0 0 1 32 0 v ${interpolate(lock, [0, 1], [-2, 14])}`}
              fill="none"
              stroke={COLORS.signal}
              strokeWidth={6}
              strokeLinecap="round"
            />
          </g>
        )}

        {/* WiFi waves + travelling encrypted packet */}
        {travel > 0 && (
          <>
            {[0, 1, 2, 3].map((i) => {
              const wp = (frame * 0.04 + i * 0.25) % 1;
              return (
                <path
                  key={i}
                  d={`M ${LAPTOP_X + 120} ${Y - 40 * wp - 8} q ${60 + wp * 60} ${20 + wp * 30} 0 ${80 + wp * 80}`}
                  fill="none"
                  stroke={COLORS.signal}
                  strokeWidth={2}
                  opacity={(1 - wp) * 0.5}
                />
              );
            })}
            <g transform={`translate(${packetX} ${Y})`} filter="url(#t3-glow)">
              <rect x={-22} y={-22} width={44} height={44} rx={8} fill={COLORS.signal} />
              <rect x={-9} y={-3} width={18} height={14} rx={2} fill={COLORS.bg} />
              <path d="M -6 -3 v -6 a 6 6 0 0 1 12 0 v 6" fill="none" stroke={COLORS.bg} strokeWidth={3} />
            </g>
          </>
        )}
      </svg>

      <Caption
        text="Encrypted, then sent"
        sub="TLS locks the channel before a single byte leaves the laptop"
        position="bottom"
      />
    </Background>
  );
};
