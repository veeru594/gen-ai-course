import { useEffect, useMemo, useState } from "react";
import "./ReactLoopDemo.css";

type FrameKind = "task" | "thought" | "action" | "observation" | "answer" | "guard";

interface Frame {
  kind: FrameKind;
  text: string;
}

const HEALTHY: Frame[] = [
  {
    kind: "task",
    text: "What's 23% of the average of these 3 invoice totals? (INV-2041, INV-2042, INV-2043)",
  },
  {
    kind: "thought",
    text: "I need the three invoice totals before I can average anything. Fetch them one by one.",
  },
  { kind: "action", text: 'get_invoice_total({ "invoice_id": "INV-2041" })' },
  { kind: "observation", text: "1240.00" },
  { kind: "action", text: 'get_invoice_total({ "invoice_id": "INV-2042" })' },
  { kind: "observation", text: "980.00" },
  { kind: "action", text: 'get_invoice_total({ "invoice_id": "INV-2043" })' },
  { kind: "observation", text: "1530.00" },
  {
    kind: "thought",
    text: "Average = (1240 + 980 + 1530) / 3 = 1250. Now compute 23% of it — use the calculator, don't do mental math in production.",
  },
  { kind: "action", text: 'calculator({ "expression": "1250 * 0.23" })' },
  { kind: "observation", text: "287.5" },
  {
    kind: "answer",
    text: "23% of the average invoice total is 287.50.",
  },
];

const RUNAWAY: Frame[] = [
  {
    kind: "task",
    text: 'Find the invoice from vendor "Acme GmbH". (The only tool available looks up invoices by ID — a tooling gap, not a model failure.)',
  },
  {
    kind: "thought",
    text: "I should search for invoices from Acme GmbH.",
  },
  { kind: "action", text: 'search_invoices({ "vendor": "Acme GmbH" })' },
  { kind: "observation", text: "[] (no results)" },
  {
    kind: "thought",
    text: "No results. Perhaps the search failed — I will try the same search again.",
  },
  { kind: "action", text: 'search_invoices({ "vendor": "Acme GmbH" })' },
  { kind: "observation", text: "[] (no results)" },
  {
    kind: "thought",
    text: "Still nothing. Trying once more.",
  },
  { kind: "action", text: 'search_invoices({ "vendor": "Acme GmbH" })' },
  { kind: "observation", text: "[] (no results)" },
  { kind: "action", text: 'search_invoices({ "vendor": "Acme GmbH" })' },
  { kind: "observation", text: "[] (no results)" },
  { kind: "action", text: 'search_invoices({ "vendor": "Acme GmbH" })' },
  { kind: "observation", text: "[] (no results)" },
  {
    kind: "guard",
    text: "MAX_ITERATIONS (5) reached — identical action repeated 5×, no progress between observations. Run terminated. Without this guard the loop runs until your budget does.",
  },
];

const KIND_LABEL: Record<FrameKind, string> = {
  task: "TASK",
  thought: "THOUGHT",
  action: "ACTION",
  observation: "OBSERVATION",
  answer: "ANSWER",
  guard: "GUARD",
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function TypedText({ text, instant }: { text: string; instant: boolean }) {
  const [count, setCount] = useState(instant ? text.length : 0);

  useEffect(() => {
    if (instant) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const interval = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(interval);
          return c;
        }
        return c + 3;
      });
    }, 16);
    return () => window.clearInterval(interval);
  }, [text, instant]);

  return <>{text.slice(0, count)}</>;
}

export function ReactLoopDemo() {
  const [preset, setPreset] = useState<"healthy" | "runaway">("healthy");
  const [revealed, setRevealed] = useState(1);
  const reduced = usePrefersReducedMotion();

  const frames = preset === "healthy" ? HEALTHY : RUNAWAY;
  const visible = frames.slice(0, revealed);
  const finished = revealed >= frames.length;
  const iterations = useMemo(
    () => visible.filter((f) => f.kind === "action").length,
    [visible],
  );

  function switchPreset(p: "healthy" | "runaway") {
    setPreset(p);
    setRevealed(1);
  }

  return (
    <div className="react-loop-demo">
      <div className="demo-controls" role="group" aria-label="Choose a trace">
        <button
          type="button"
          className="demo-btn"
          aria-pressed={preset === "healthy"}
          onClick={() => switchPreset("healthy")}
        >
          healthy run
        </button>
        <button
          type="button"
          className="demo-btn"
          aria-pressed={preset === "runaway"}
          onClick={() => switchPreset("runaway")}
        >
          runaway loop
        </button>
        <span className="react-loop-counter meta" aria-live="polite">
          loop iterations: {iterations} / 5 max
        </span>
      </div>

      <div className="react-loop-trace" role="log">
        {visible.map((f, i) => (
          <div key={`${preset}-${i}`} className={`react-loop-frame frame-${f.kind}`}>
            <span className="react-loop-kind">{KIND_LABEL[f.kind]}</span>
            <span className="react-loop-text">
              <TypedText text={f.text} instant={reduced || i < revealed - 1} />
            </span>
          </div>
        ))}
      </div>

      <div className="demo-controls">
        <button
          type="button"
          className="demo-btn is-primary"
          onClick={() => setRevealed((r) => Math.min(r + 1, frames.length))}
          disabled={finished}
        >
          {finished ? "trace complete" : "next step"}
        </button>
        <button
          type="button"
          className="demo-btn"
          onClick={() => setRevealed(1)}
          disabled={revealed <= 1}
        >
          reset
        </button>
      </div>

      <p className="demo-note">
        The healthy trace shows the loop working: each observation changes the
        next decision. The runaway trace shows the most common production
        failure — and the max-iterations guard that contains it.
      </p>
    </div>
  );
}
