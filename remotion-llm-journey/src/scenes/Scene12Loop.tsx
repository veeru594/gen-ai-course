import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../Root";
import { Background, Caption, SceneTag } from "./_shared";

/* SCENE 12 — THE LOOP
   The whole round trip happens once per token. A token races around the
   journey-loop; each completed lap appends a word to the growing response, and
   the laps accelerate. The realisation: this repeats for every word. */

const SENTENCE =
  "Attention lets every token weigh every other token before the next is chosen".split(
    " ",
  );

const CX = 960;
const CY = 400;
const R = 200;

// stages placed around the loop
const STAGES = ["screen", "network", "cables", "data center", "GPU"];

export const Scene12Loop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const prog = interpolate(frame, [10, durationInFrames - 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // accelerate: laps pile up faster as the scene goes on
  const totalLaps = SENTENCE.length;
  const laps = Math.pow(prog, 1.7) * totalLaps;
  const wordsOut = Math.min(SENTENCE.length, Math.floor(laps));
  const angle = (laps % 1) * Math.PI * 2 - Math.PI / 2;

  const tokenX = CX + R * Math.cos(angle);
  const tokenY = CY + R * Math.sin(angle);

  // half the ring is outbound (amber), half is return (teal)
  const arc = (a0: number, a1: number) => {
    const x0 = CX + R * Math.cos(a0);
    const y0 = CY + R * Math.sin(a0);
    const x1 = CX + R * Math.cos(a1);
    const y1 = CY + R * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`;
  };

  return (
    <Background>
      <SceneTag index={12} label="The loop" />

      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <filter id="t12-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* the journey loop: outbound (amber) top, return (teal) bottom */}
        <path d={arc(-Math.PI / 2, Math.PI / 2)} fill="none" stroke={COLORS.signal} strokeWidth={3} opacity={0.7} />
        <path d={arc(Math.PI / 2, (3 * Math.PI) / 2)} fill="none" stroke={COLORS.response} strokeWidth={3} opacity={0.7} />

        {/* stage markers around the ring */}
        {STAGES.map((s, i) => {
          const a = -Math.PI / 2 + (i / STAGES.length) * Math.PI * 2;
          const x = CX + R * Math.cos(a);
          const y = CY + R * Math.sin(a);
          const lx = CX + (R + 40) * Math.cos(a);
          const ly = CY + (R + 40) * Math.sin(a);
          return (
            <g key={s}>
              <circle cx={x} cy={y} r={6} fill={COLORS.node} stroke={COLORS.nodeBorder} strokeWidth={1.2} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontFamily="ui-monospace, monospace" fontSize={15} fill={COLORS.textFaint}>
                {s}
              </text>
            </g>
          );
        })}

        {/* the racing token */}
        <circle cx={tokenX} cy={tokenY} r={13} fill={angle < Math.PI / 2 && angle > -Math.PI / 2 ? COLORS.signal : COLORS.response} filter="url(#t12-glow)" />

        {/* round-trip counter at the centre */}
        <text x={CX} y={CY - 6} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={56} fontWeight={700} fill={COLORS.text}>
          {wordsOut}
        </text>
        <text x={CX} y={CY + 34} textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize={20} fill={COLORS.textDim}>
          round trips
        </text>

        {/* the response building word by word */}
        <foreignObject x={260} y={720} width={1400} height={200}>
          <div
            style={{
              fontSize: 38,
              lineHeight: 1.5,
              color: COLORS.textDim,
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            {SENTENCE.slice(0, wordsOut).map((w, i) => (
              <span key={i} style={{ color: i === wordsOut - 1 ? COLORS.response : COLORS.text }}>
                {w}{" "}
              </span>
            ))}
            <span style={{ color: COLORS.response }}>▌</span>
          </div>
        </foreignObject>
      </svg>

      <Caption text="One full round trip — per token" position="bottom" />
    </Background>
  );
};
