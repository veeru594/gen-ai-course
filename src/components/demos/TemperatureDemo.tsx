import { useMemo, useState } from "react";
import "./TemperatureDemo.css";

interface Candidate {
  token: string;
  logit: number;
}

// preset logits for: "The capital of France is ___"
const CANDIDATES: Candidate[] = [
  { token: "Paris", logit: 9.2 },
  { token: "the", logit: 5.6 },
  { token: "located", logit: 5.1 },
  { token: "Lyon", logit: 4.4 },
  { token: "Marseille", logit: 4.0 },
  { token: "beautiful", logit: 3.4 },
  { token: "Berlin", logit: 2.9 },
  { token: "croissant", logit: 2.2 },
];

function softmax(logits: number[], temperature: number): number[] {
  const scaled = logits.map((l) => l / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const BAR_W = 300;
const ROW_H = 30;
const LABEL_W = 96;

export function TemperatureDemo() {
  const [temperature, setTemperature] = useState(0.7);
  const [samples, setSamples] = useState<string[]>([]);

  const probs = useMemo(
    () =>
      softmax(
        CANDIDATES.map((c) => c.logit),
        temperature,
      ),
    [temperature],
  );

  function sample() {
    const r = Math.random();
    let acc = 0;
    let picked = CANDIDATES[CANDIDATES.length - 1].token;
    for (let i = 0; i < probs.length; i++) {
      acc += probs[i];
      if (r <= acc) {
        picked = CANDIDATES[i].token;
        break;
      }
    }
    setSamples((prev) => [...prev.slice(-9), picked]);
  }

  const chartH = CANDIDATES.length * ROW_H;

  return (
    <div className="temperature-demo">
      <p className="temperature-scenario">
        <span className="meta">prompt</span> “The capital of France is{" "}
        <span className="temperature-blank">___</span>”
      </p>

      <div className="demo-controls">
        <label className="meta" htmlFor="temp-slider">
          temperature
        </label>
        <input
          id="temp-slider"
          className="demo-range"
          type="range"
          min={0.1}
          max={2}
          step={0.05}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
        />
        <output className="temperature-value" htmlFor="temp-slider">
          T = {temperature.toFixed(2)}
        </output>
      </div>

      <svg
        className="temperature-chart"
        viewBox={`0 0 ${LABEL_W + BAR_W + 64} ${chartH}`}
        role="img"
        aria-label={`Probability distribution over next tokens at temperature ${temperature.toFixed(2)}`}
      >
        {CANDIDATES.map((c, i) => {
          const p = probs[i];
          const y = i * ROW_H;
          return (
            <g key={c.token}>
              <text
                x={LABEL_W - 8}
                y={y + ROW_H / 2 + 4}
                textAnchor="end"
                className="temperature-token"
              >
                {c.token}
              </text>
              <rect
                x={LABEL_W}
                y={y + 6}
                width={Math.max(2, p * BAR_W)}
                height={ROW_H - 12}
                rx={2}
                className={i === 0 ? "temperature-bar is-top" : "temperature-bar"}
              />
              <text
                x={LABEL_W + Math.max(2, p * BAR_W) + 8}
                y={y + ROW_H / 2 + 4}
                className="temperature-pct"
              >
                {(p * 100).toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>

      <div className="demo-controls">
        <button type="button" className="demo-btn is-primary" onClick={sample}>
          sample a token
        </button>
        <button
          type="button"
          className="demo-btn"
          onClick={() => setSamples([])}
          disabled={samples.length === 0}
        >
          clear
        </button>
      </div>

      {samples.length > 0 && (
        <p className="demo-log temperature-samples" aria-live="polite">
          <span className="log-dim">sampled → </span>
          {samples.map((s, i) => (
            <span key={i} className={s === "Paris" ? "log-ok" : "log-err"}>
              {s}
              {i < samples.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      )}

      <p className="demo-note">
        At T = 0.1 it always says Paris. Push T past 1.5 and sample a few times
        — that moment when it says “croissant” is the lesson: temperature
        reshapes the distribution the next token is drawn from.
      </p>
    </div>
  );
}
