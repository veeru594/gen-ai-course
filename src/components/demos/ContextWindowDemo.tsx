import { useMemo, useState } from "react";
import "./ContextWindowDemo.css";

/** A small, fixed budget so overflow happens after a few turns. */
const WINDOW = 1000;

interface Turn {
  role: "user" | "assistant";
  text: string;
  tokens: number;
}

/** A canned back-and-forth. Token counts are illustrative, not exact. */
const SCRIPT: Turn[] = [
  { role: "user", text: "System: you are a travel assistant.", tokens: 120 },
  { role: "user", text: "Plan me 3 days in Rome.", tokens: 110 },
  { role: "assistant", text: "Day 1 Colosseum, Day 2 Vatican, Day 3 Trastevere…", tokens: 230 },
  { role: "user", text: "Make day 2 about food instead.", tokens: 130 },
  { role: "assistant", text: "Day 2 now: Testaccio market, pasta class, gelato crawl…", tokens: 240 },
  { role: "user", text: "What was my hotel budget again?", tokens: 120 },
  { role: "assistant", text: "You never told me a hotel budget in what I can still see.", tokens: 180 },
];

export function ContextWindowDemo() {
  const [added, setAdded] = useState(2);

  /** Newest turns kept; oldest fall out once the budget is exceeded. */
  const { kept, evicted, used } = useMemo(() => {
    const all = SCRIPT.slice(0, added);
    const keptRev: Turn[] = [];
    let total = 0;
    // walk newest -> oldest, keep what fits
    for (let i = all.length - 1; i >= 0; i--) {
      if (total + all[i].tokens <= WINDOW) {
        total += all[i].tokens;
        keptRev.unshift(all[i]);
      }
    }
    const keptSet = new Set(keptRev);
    return {
      kept: all.filter((t) => keptSet.has(t)),
      evicted: all.filter((t) => !keptSet.has(t)),
      used: total,
    };
  }, [added]);

  const pct = Math.round((used / WINDOW) * 100);
  const full = added >= SCRIPT.length;

  return (
    <div className="ctxwin-demo">
      <div className="ctxwin-meter" aria-hidden="true">
        <div className="ctxwin-meter-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="ctxwin-readout meta" aria-live="polite">
        {used} / {WINDOW} tokens used · {evicted.length} turn
        {evicted.length === 1 ? "" : "s"} pushed out of the window
      </p>

      <div className="ctxwin-stack" role="log">
        {evicted.map((t, i) => (
          <div key={`ev-${i}`} className={`ctxwin-turn is-evicted role-${t.role}`}>
            <span className="ctxwin-role">{t.role}</span>
            <span className="ctxwin-text">{t.text}</span>
            <span className="ctxwin-tok meta">{t.tokens}</span>
          </div>
        ))}
        {evicted.length > 0 && (
          <div className="ctxwin-line" aria-hidden="true">
            ↑ outside the window — the model can no longer see these
          </div>
        )}
        {kept.map((t, i) => (
          <div key={`keep-${i}`} className={`ctxwin-turn role-${t.role}`}>
            <span className="ctxwin-role">{t.role}</span>
            <span className="ctxwin-text">{t.text}</span>
            <span className="ctxwin-tok meta">{t.tokens}</span>
          </div>
        ))}
      </div>

      <div className="demo-controls">
        <button
          type="button"
          className="demo-btn is-primary"
          onClick={() => setAdded((a) => Math.min(a + 1, SCRIPT.length))}
          disabled={full}
        >
          {full ? "conversation over" : "add next turn"}
        </button>
        <button
          type="button"
          className="demo-btn"
          onClick={() => setAdded(2)}
          disabled={added <= 2}
        >
          reset
        </button>
      </div>

      <p className="demo-note">
        The window is a fixed {WINDOW}-token budget. Newer turns are always
        kept; once they don't all fit, the oldest turns drop out entirely — the
        model isn't summarising them, it simply can't see them. By the last
        turn the assistant has literally lost the hotel budget you mentioned.
        That eviction is exactly the problem RAG and memory are built to solve.
      </p>
    </div>
  );
}
