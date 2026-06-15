import { Composition, Series } from "remotion";

import { Scene01Keystroke } from "./scenes/Scene01Keystroke";
import { Scene02Serialise } from "./scenes/Scene02Serialise";
import { Scene03Leaving } from "./scenes/Scene03Leaving";
import { Scene04Network } from "./scenes/Scene04Network";
import { Scene05Undersea } from "./scenes/Scene05Undersea";
import { Scene06DataCenter } from "./scenes/Scene06DataCenter";
import { Scene07GPU } from "./scenes/Scene07GPU";
import { Scene08Transformer } from "./scenes/Scene08Transformer";
import { Scene09Attention } from "./scenes/Scene09Attention";
import { Scene10Logits } from "./scenes/Scene10Logits";
import { Scene11Return } from "./scenes/Scene11Return";
import { Scene12Loop } from "./scenes/Scene12Loop";
import { Scene13Scale } from "./scenes/Scene13Scale";

/* ────────────────────────────────────────────────────────────────────────
   SHARED CONSTANTS — every scene imports from here.
   Change a colour or a duration once, and the whole film follows.
   ──────────────────────────────────────────────────────────────────────── */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const COLORS = {
  bg: "#F7F6F2", // paper — matches the site, light throughout
  bgSoft: "#EFEDE6", // sunk panels behind the background
  signal: "#E8593C", // outbound request — electric amber/orange
  response: "#15916B", // return path — teal/green (deepened for light)
  node: "#FFFFFF", // light cards
  nodeBorder: "#9A978B", // card borders — clear gray, reads as line-art on paper
  compute: "#2C77C9", // GPU / compute accent — electric blue (deepened)
  attention: "#D9870E", // transformer attention glow — warm amber (deepened)
  text: "#1A1A1C", // ink
  textDim: "#5D5D63",
  textFaint: "#9A978B",
} as const;

export const FONT_FAMILY =
  '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/* Scene durations, in seconds. The Composition length is derived from these,
   so adding or retiming a scene never desyncs the total. */
export const SCENE_SECONDS = {
  s01: 4,
  s02: 5,
  s03: 5,
  s04: 8,
  s05: 8,
  s06: 6,
  s07: 8,
  s08: 12,
  s09: 12,
  s10: 8,
  s11: 6,
  s12: 8,
  s13: 6,
} as const;

const f = (seconds: number) => Math.round(seconds * FPS);

const SCENES = [
  { key: "s01", seconds: SCENE_SECONDS.s01, Component: Scene01Keystroke },
  { key: "s02", seconds: SCENE_SECONDS.s02, Component: Scene02Serialise },
  { key: "s03", seconds: SCENE_SECONDS.s03, Component: Scene03Leaving },
  { key: "s04", seconds: SCENE_SECONDS.s04, Component: Scene04Network },
  { key: "s05", seconds: SCENE_SECONDS.s05, Component: Scene05Undersea },
  { key: "s06", seconds: SCENE_SECONDS.s06, Component: Scene06DataCenter },
  { key: "s07", seconds: SCENE_SECONDS.s07, Component: Scene07GPU },
  { key: "s08", seconds: SCENE_SECONDS.s08, Component: Scene08Transformer },
  { key: "s09", seconds: SCENE_SECONDS.s09, Component: Scene09Attention },
  { key: "s10", seconds: SCENE_SECONDS.s10, Component: Scene10Logits },
  { key: "s11", seconds: SCENE_SECONDS.s11, Component: Scene11Return },
  { key: "s12", seconds: SCENE_SECONDS.s12, Component: Scene12Loop },
  { key: "s13", seconds: SCENE_SECONDS.s13, Component: Scene13Scale },
] as const;

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + f(s.seconds), 0);

/** Strings every scene together back-to-back. */
const LlmJourney: React.FC = () => {
  return (
    <Series>
      {SCENES.map((scene) => (
        <Series.Sequence key={scene.key} durationInFrames={f(scene.seconds)}>
          <scene.Component />
        </Series.Sequence>
      ))}
    </Series>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LlmJourney"
      component={LlmJourney}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
