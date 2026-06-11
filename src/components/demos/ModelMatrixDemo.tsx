import { useState } from "react";
import "./ModelMatrixDemo.css";

type TaskId = "json" | "longdoc" | "reasoning" | "voice" | "volume";

interface Task {
  id: TaskId;
  label: string;
  verdict: string;
}

interface Score {
  fit: number;
  costEff: number;
  speed: number;
}

const TASKS: Task[] = [
  {
    id: "json",
    label: "JSON extraction",
    verdict:
      "GPT-4o: structured output mode guarantees the schema — an entire category of parsing failures gone.",
  },
  {
    id: "longdoc",
    label: "500-page document",
    verdict:
      "Gemini: the entire document in one call — no chunking, no embeddings, no RAG pipeline to build.",
  },
  {
    id: "reasoning",
    label: "Multi-step reasoning",
    verdict:
      "o-series: it reasons before it responds. Pay the latency and the price; get the logic.",
  },
  {
    id: "voice",
    label: "Voice output",
    verdict:
      "ElevenLabs: the specialist. No general-purpose model matches it for voice-specific work.",
  },
  {
    id: "volume",
    label: "High-volume cheap classification",
    verdict:
      "Cheap tiers win — Haiku, GPT-4o mini, Flash. The most appropriate model, not the most capable.",
  },
];

const MODELS = [
  "Claude (Sonnet/Haiku)",
  "GPT-4o / mini",
  "o-series (o1, o3)",
  "Gemini (Pro/Flash)",
  "ElevenLabs",
] as const;

type ModelName = (typeof MODELS)[number];

const SCORES: Record<TaskId, Record<ModelName, Score>> = {
  json: {
    "Claude (Sonnet/Haiku)": { fit: 9, costEff: 6, speed: 7 },
    "GPT-4o / mini": { fit: 10, costEff: 6, speed: 7 },
    "o-series (o1, o3)": { fit: 7, costEff: 2, speed: 2 },
    "Gemini (Pro/Flash)": { fit: 8, costEff: 7, speed: 7 },
    ElevenLabs: { fit: 0, costEff: 0, speed: 0 },
  },
  longdoc: {
    "Claude (Sonnet/Haiku)": { fit: 8, costEff: 5, speed: 6 },
    "GPT-4o / mini": { fit: 5, costEff: 6, speed: 7 },
    "o-series (o1, o3)": { fit: 4, costEff: 2, speed: 2 },
    "Gemini (Pro/Flash)": { fit: 10, costEff: 6, speed: 6 },
    ElevenLabs: { fit: 0, costEff: 0, speed: 0 },
  },
  reasoning: {
    "Claude (Sonnet/Haiku)": { fit: 8, costEff: 4, speed: 4 },
    "GPT-4o / mini": { fit: 6, costEff: 6, speed: 7 },
    "o-series (o1, o3)": { fit: 10, costEff: 2, speed: 2 },
    "Gemini (Pro/Flash)": { fit: 7, costEff: 6, speed: 5 },
    ElevenLabs: { fit: 0, costEff: 0, speed: 0 },
  },
  voice: {
    "Claude (Sonnet/Haiku)": { fit: 1, costEff: 0, speed: 0 },
    "GPT-4o / mini": { fit: 6, costEff: 5, speed: 6 },
    "o-series (o1, o3)": { fit: 0, costEff: 0, speed: 0 },
    "Gemini (Pro/Flash)": { fit: 4, costEff: 5, speed: 6 },
    ElevenLabs: { fit: 10, costEff: 6, speed: 7 },
  },
  volume: {
    "Claude (Sonnet/Haiku)": { fit: 8, costEff: 9, speed: 9 },
    "GPT-4o / mini": { fit: 8, costEff: 9, speed: 9 },
    "o-series (o1, o3)": { fit: 2, costEff: 1, speed: 1 },
    "Gemini (Pro/Flash)": { fit: 9, costEff: 10, speed: 9 },
    ElevenLabs: { fit: 0, costEff: 0, speed: 0 },
  },
};

const BAR_KEYS: Array<{ key: keyof Score; label: string }> = [
  { key: "fit", label: "capability fit" },
  { key: "costEff", label: "cost efficiency" },
  { key: "speed", label: "speed" },
];

export function ModelMatrixDemo() {
  const [taskId, setTaskId] = useState<TaskId>("json");
  const task = TASKS.find((t) => t.id === taskId) ?? TASKS[0];
  const scores = SCORES[taskId];
  const topFit = Math.max(...MODELS.map((m) => scores[m].fit));

  return (
    <div className="matrix-demo">
      <div
        className="demo-controls matrix-tasks"
        role="group"
        aria-label="Pick a task"
      >
        {TASKS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="demo-btn"
            aria-pressed={t.id === taskId}
            onClick={() => setTaskId(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="matrix-verdict">
        <span className="meta">verdict</span> {task.verdict}
      </p>

      <div className="matrix-rows">
        {MODELS.map((m) => {
          const s = scores[m];
          const leader = s.fit === topFit && s.fit > 0;
          return (
            <div
              key={m}
              className={`matrix-row${leader ? " is-leader" : ""}`}
            >
              <span className="matrix-model">
                {m}
                {leader && <span className="matrix-pick meta"> ← pick</span>}
              </span>
              <div className="matrix-bars">
                {BAR_KEYS.map(({ key, label }) => (
                  <div key={key} className="matrix-bar-line">
                    <span className="matrix-bar-label">{label}</span>
                    <span className="matrix-bar-track">
                      <span
                        className={`matrix-bar-fill matrix-bar-${key}`}
                        style={{ width: `${s[key] * 10}%` }}
                      />
                    </span>
                    <span className="matrix-bar-num">
                      {s[key] === 0 ? "—" : s[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="demo-note">
        Scores are illustrative, hardcoded, and deliberately opinionated — the
        point is the habit of scoring capability-fit, cost, and latency per
        task instead of asking which model is best.
      </p>
    </div>
  );
}
