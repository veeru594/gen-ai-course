import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { modules } from "../../data/modules";
import { DrfLogo } from "./DrfLogo";
import "./Header.css";

const SHORT_NAMES: Record<string, string> = {
  foundations: "GenAI Foundations & LLMs",
  automation: "Automation Platforms",
  models: "Models & Tool Exploration",
  agents: "Agentic AI Frameworks",
  python: "Python Integration",
};

function ModulesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        type="button"
        className="nav-link nav-dropdown-btn"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
      >
        Modules <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="nav-dropdown-menu">
          {modules.map((m) => (
            <NavLink
              key={m.id}
              to={`/module/${m.id}`}
              className="nav-dropdown-item"
              data-module={m.id}
              onClick={() => setOpen(false)}
            >
              <span className="nav-dropdown-dot" aria-hidden="true" />
              <span className="nav-dropdown-num">M{m.number}</span>
              {SHORT_NAMES[m.id]}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <div className="site-header-brand">
          <DrfLogo />
          <span className="site-header-divider" aria-hidden="true" />
          <Link to="/" className="brand">
            <span className="brand-name">Automation with Generative AI</span>
          </Link>
        </div>
        <nav className="site-nav" aria-label="Primary">
          <ModulesDropdown />
          <NavLink to="/playground" className="nav-link">
            Playground
          </NavLink>
          <NavLink to="/capstone" className="nav-link">
            Capstone
          </NavLink>
          <NavLink to="/resources" className="nav-link">
            Resources
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
