import { useMemo, useState } from "react";
import "./BackoffDemo.css";

type Mode = "hammer" | "backoff";

/** The rate limit clears once enough real time has passed. */
const CLEAR_AFTER_MS = 7000;
const MAX_ATTEMPTS = 6;

interface Attempt {
  n: number;
  waited: number; // ms waited before this attempt
  elapsed: number; // total ms elapsed when this attempt fires
  ok: boolean;
}

function buildAttempts(mode: Mode): Attempt[] {
  const out: Attempt[] = [];
  let elapsed = 0;
  for (let n = 1; n <= MAX_ATTEMPTS; n++) {
    // hammer retries instantly; backoff doubles: 0, 1s, 2s, 4s, 8s...
    const waited = n === 1 ? 0 : mode === "hammer" ? 200 : 1000 * 2 ** (n - 2);
    elapsed += waited;
    const ok = elapsed >= CLEAR_AFTER_MS;
    out.push({ n, waited, elapsed, ok });
    if (ok) break;
  }
  return out;
}

function fmt(ms: number): string {
  if (ms === 0) return "0s";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(ms % 1000 ? 1 : 0)}s`;
}

export function BackoffDemo() {
  const [mode, setMode] = useState<Mode>("backoff");
  const [shown, setShown] = useState(1);

  const attempts = useMemo(() => buildAttempts(mode), [mode]);
  const visible = attempts.slice(0, shown);
  const last = visible[visible.length - 1];
  const done = last?.ok || shown >= attempts.length;
  const succeeded = visible.some((a) => a.ok);

  function pick(m: Mode) {
    setMode(m);
    setShown(1);
  }

  return (
    <div className="backoff-demo">
      <div className="demo-controls" role="group" aria-label="Choose a retry strategy">
        <button
          type="button"
          className="demo-btn"
          aria-pressed={mode === "hammer"}
          onClick={() => pick("hammer")}
        >
          retry immediately
        </button>
        <button
          type="button"
          className="demo-btn"
          aria-pressed={mode === "backoff"}
          onClick={() => pick("backoff")}
        >
          exponential backoff
        </button>
      </div>

      <div className="demo-log backoff-log" role="log">
        {visible.map((a) => (
          <div key={a.n} className="backoff-row">
            <span className="log-dim">
              {a.waited > 0 ? `wait ${fmt(a.waited)} →` : "call →"}
            </span>{" "}
            <span className="backoff-attempt">POST /v1/messages</span>{" "}
            {a.ok ? (
              <span className="log-ok">200 OK ✓ (after {fmt(a.elapsed)})</span>
            ) : (
              <span className="log-err">429 Too Many Requests</span>
            )}
          </div>
        ))}
        {!done && (
          <div className="backoff-row log-dim">…limit still active, retrying</div>
        )}
        {done && !succeeded && (
          <div className="backoff-row log-err">
            gave up after {MAX_ATTEMPTS} attempts — never waited long enough
          </div>
        )}
      </div>

      <div className="demo-controls">
        <button
          type="button"
          className="demo-btn is-primary"
          onClick={() => setShown((s) => Math.min(s + 1, attempts.length))}
          disabled={done}
        >
          {done ? (succeeded ? "succeeded" : "stopped") : "next attempt"}
        </button>
        <button
          type="button"
          className="demo-btn"
          onClick={() => setShown(1)}
          disabled={shown <= 1}
        >
          reset
        </button>
      </div>

      <p className="demo-note">
        The rate limit clears about {fmt(CLEAR_AFTER_MS)} after it trips.
        Retrying immediately keeps slamming a busy API and gets rejected over
        and over. Doubling the wait — 1s, 2s, 4s — gives the limit time to
        clear, so the call succeeds in far fewer attempts and stops making the
        problem worse. Same call, same limit; only the waiting changed.
      </p>
    </div>
  );
}
