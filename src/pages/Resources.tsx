import { useMemo, useState } from "react";
import { allResources } from "../data/resources";
import { modules } from "../data/modules";
import type { ModuleId } from "../data/types";
import "./Resources.css";

type Filter = ModuleId | "general";

const FILTERS: Array<{ id: Filter; label: string }> = [
  ...modules.map((m) => ({ id: m.id, label: `M${m.number}` })),
  { id: "general", label: "GENERAL" },
];

export function Resources() {
  const [active, setActive] = useState<ReadonlySet<Filter>>(new Set());
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allResources.filter((r) => {
      if (active.size > 0 && !active.has(r.module)) {
        return false;
      }
      if (
        q &&
        !`${r.label} ${r.purpose} ${r.url}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [active, query]);

  function toggle(id: Filter) {
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

  return (
    <div className="container resources-page">
      <header className="resources-head">
        <h1>Resource library</h1>
        <p>
          Every link from every module rail, in one filterable list. Official
          sources only — docs, papers, and tools the curriculum actually uses.
          Each link says what it is for, not just what it is called.
        </p>
      </header>

      <div className="resources-controls">
        <div
          className="resources-chips"
          role="group"
          aria-label="Filter by module"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              data-module={f.id !== "general" ? f.id : undefined}
              className="resources-chip"
              aria-pressed={active.has(f.id)}
              onClick={() => toggle(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="resources-search"
          placeholder="Search links…"
          aria-label="Search resources"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <p className="meta resources-count" aria-live="polite">
        {filtered.length} of {allResources.length} links
      </p>

      <ul className="resources-list">
        {filtered.map((r) => (
          <li
            key={`${r.module}-${r.url}`}
            className="resources-row"
            data-module={r.module !== "general" ? r.module : undefined}
          >
            <span className="resources-row-tag meta">
              {r.module === "general"
                ? "GEN"
                : `M${modules.find((m) => m.id === r.module)?.number}`}
            </span>
            <span className="resources-row-body">
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.label}
              </a>
              <span className="resources-row-purpose">{r.purpose}</span>
            </span>
            <span className="resources-row-url meta">
              {new URL(r.url).hostname}
            </span>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="resources-empty">
          Nothing matches. Clear a filter or try a different search term.
        </p>
      )}
    </div>
  );
}
