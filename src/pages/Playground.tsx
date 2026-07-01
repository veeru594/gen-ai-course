import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { modules } from "../data/modules";
import type { ModuleId } from "../data/types";
import { DemoHost } from "../components/demos/DemoHost";
import "./Playground.css";

const FILTERS: Array<{ id: ModuleId; label: string }> = modules.map((m) => ({
  id: m.id,
  label: `M${m.number}`,
}));

export function Playground() {
  const entries = useMemo(
    () =>
      modules.flatMap((m) =>
        m.demos.map((spec) => ({ module: m, spec })),
      ),
    [],
  );

  const [active, setActive] = useState<ReadonlySet<ModuleId>>(new Set());

  const visible = useMemo(
    () =>
      active.size === 0
        ? entries
        : entries.filter((e) => active.has(e.module.id)),
    [entries, active],
  );

  function toggle(id: ModuleId) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function jumpTo(id: string) {
    const el = document.getElementById(`entry-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="container playground">
      <header className="playground-head">
        <h1>Playground</h1>
        <p>
          All eight teaching demos on one page. Each one is pure client-side
          code — no API keys, no network calls — built to make one idea from
          the curriculum impossible to forget. The module pages embed them
          where they teach best; here they are in one room.
        </p>
      </header>

      <nav className="playground-nav" aria-label="Demo navigation">
        <div
          className="playground-filters"
          role="group"
          aria-label="Filter demos by module"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              data-module={f.id}
              className="playground-filter"
              aria-pressed={active.has(f.id)}
              onClick={() => toggle(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="playground-jumps">
          {visible.map(({ module, spec }) => (
            <button
              key={spec.id}
              type="button"
              data-module={module.id}
              className="playground-jump"
              onClick={() => jumpTo(spec.id)}
            >
              {spec.title}
            </button>
          ))}
        </div>
      </nav>

      <p className="meta playground-count" aria-live="polite">
        {visible.length} of {entries.length} demos
      </p>

      {visible.map(({ module, spec }) => (
        <article
          key={spec.id}
          id={`entry-${spec.id}`}
          data-module={module.id}
          className="playground-entry"
        >
          <p className="meta playground-entry-meta">
            from{" "}
            <Link to={`/module/${module.id}`}>
              MODULE {module.number} — {module.title}
            </Link>
          </p>
          <DemoHost spec={spec} />
        </article>
      ))}

      {visible.length === 0 && (
        <p className="playground-empty">
          No demos for that filter. Clear a module to see the rest.
        </p>
      )}
    </div>
  );
}
