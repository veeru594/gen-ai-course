import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../Root";

/* Stateless presentational helpers shared by every scene. They hold no
   timeline state of their own — each scene still drives its own animation. */

/** Full-frame background in the infrastructure-night base colour. */
export const Background: React.FC<{ children?: React.ReactNode; color?: string }> = ({
  children,
  color = COLORS.bg,
}) => (
  <AbsoluteFill style={{ backgroundColor: color, fontFamily: FONT_FAMILY }}>
    {children}
  </AbsoluteFill>
);

/**
 * A minimal caption. Fades in early, holds, fades out near the scene end.
 * `position` controls vertical placement.
 */
export const Caption: React.FC<{
  text: string;
  sub?: string;
  position?: "top" | "bottom" | "center";
  color?: string;
}> = ({ text, sub, position = "bottom", color = COLORS.text }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 14, durationInFrames - 16, durationInFrames - 2],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rise = interpolate(frame, [0, 18], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const vertical =
    position === "top"
      ? { top: 90 }
      : position === "center"
        ? { top: "50%", transform: `translateY(calc(-50% + ${rise}px))` }
        : { bottom: 96 };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        ...vertical,
      }}
    >
      <div
        style={{
          fontSize: 46,
          fontWeight: 700,
          color,
          letterSpacing: -0.5,
          transform: position === "center" ? undefined : `translateY(${rise}px)`,
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 12,
            fontSize: 22,
            fontWeight: 400,
            color: COLORS.textDim,
            letterSpacing: 0.3,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

/** A tiny monospace step counter, top-left, e.g. "03 / 13". */
export const SceneTag: React.FC<{ index: number; label: string }> = ({
  index,
  label,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [4, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 90,
        opacity,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 18,
        letterSpacing: 2,
        color: COLORS.textFaint,
        textTransform: "uppercase",
      }}
    >
      {String(index).padStart(2, "0")} / 13 · {label}
    </div>
  );
};

/** Opacity envelope: fade in over `inF`, hold, fade out over `outF`. */
export const envelope = (
  frame: number,
  duration: number,
  inF = 12,
  outF = 12,
): number =>
  interpolate(
    frame,
    [0, inF, duration - outF, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
