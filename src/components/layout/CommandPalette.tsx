import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { modules } from "../../data/modules";
import { allResources } from "../../data/resources";
import "./CommandPalette.css";

interface PaletteItem {
  id: string;
  title: string;
  hint: string;
  keywords: string;
  external?: string;
  to?: string;
}

function buildItems(): PaletteItem[] {
  const pages: PaletteItem[] = [
    { id: "page-home", title: "Home", hint: "/", keywords: "home start modules path", to: "/" },
    { id: "page-playground", title: "Playground", hint: "/playground", keywords: "demos all interactive", to: "/playground" },
    { id: "page-capstone", title: "Capstone", hint: "/capstone", keywords: "review submission github rubric", to: "/capstone" },
    { id: "page-resources", title: "Resources", hint: "/resources", keywords: "links library docs", to: "/resources" },
  ];
  const mods: PaletteItem[] = modules.map((m) => ({
    id: `module-${m.id}`,
    title: `Module ${m.number} — ${m.title}`,
    hint: `/module/${m.id}`,
    keywords: `${m.id} ${m.tagline}`,
    to: `/module/${m.id}`,
  }));
  const demos: PaletteItem[] = modules.flatMap((m) =>
    m.demos.map((d) => ({
      id: `demo-${d.id}`,
      title: `Demo — ${d.title}`,
      hint: "playground",
      keywords: `demo interactive ${d.id} ${m.title}`,
      to: `/playground#demo-${d.id}`,
    })),
  );
  const resources: PaletteItem[] = allResources.map((r) => ({
    id: `res-${r.url}`,
    title: r.label,
    hint: "link ↗",
    keywords: `resource ${r.purpose} ${r.module}`,
    external: r.url,
  }));
  return [...pages, ...mods, ...demos, ...resources];
}

function fuzzyScore(query: string, text: string): number | null {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) {
    return 0;
  }
  const idx = t.indexOf(q);
  if (idx >= 0) {
    return 200 - Math.min(idx, 100);
  }
  let ti = 0;
  let score = 0;
  let prev = -2;
  for (const ch of q) {
    if (ch === " ") {
      continue;
    }
    const found = t.indexOf(ch, ti);
    if (found === -1) {
      return null;
    }
    score += found === prev + 1 ? 6 : 1;
    prev = found;
    ti = found + 1;
  }
  return score;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  const items = useMemo(buildItems, []);

  const results = useMemo(() => {
    const scored = items
      .map((item) => ({
        item,
        score: fuzzyScore(query, `${item.title} ${item.keywords}`),
      }))
      .filter((r): r is { item: PaletteItem; score: number } => r.score !== null)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 12).map((r) => r.item);
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        close();
      }
    }
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, [close]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  function select(item: PaletteItem) {
    close();
    if (item.external) {
      window.open(item.external, "_blank", "noopener,noreferrer");
    } else if (item.to) {
      navigate(item.to);
    }
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      select(results[cursor]);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="palette-overlay"
      onClick={close}
      role="presentation"
    >
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="palette-input"
          type="text"
          placeholder="Jump to a page, module, demo, or resource…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={
            results[cursor] ? `opt-${results[cursor].id}` : undefined
          }
          aria-autocomplete="list"
        />
        <ul
          className="palette-list"
          id="palette-list"
          role="listbox"
          ref={listRef}
        >
          {results.map((item, i) => (
            <li
              key={item.id}
              id={`opt-${item.id}`}
              role="option"
              aria-selected={i === cursor}
              className={`palette-item${i === cursor ? " is-active" : ""}`}
              onMouseEnter={() => setCursor(i)}
              onClick={() => select(item)}
            >
              <span className="palette-item-title">{item.title}</span>
              <span className="palette-item-hint meta">{item.hint}</span>
            </li>
          ))}
          {results.length === 0 && (
            <li className="palette-empty meta">no matches</li>
          )}
        </ul>
        <p className="palette-footer meta">
          <kbd>↑↓</kbd> navigate · <kbd>↵</kbd> open · <kbd>esc</kbd> close
        </p>
      </div>
    </div>
  );
}
