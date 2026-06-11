import { NavLink, Link } from "react-router-dom";
import "./Header.css";

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link to="/" className="brand">
          <span className="brand-name">Automation with Generative AI</span>
          <span className="brand-sub meta">540-hr training program</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/" end className="nav-link">
            Modules
          </NavLink>
          <NavLink to="/playground" className="nav-link">
            Playground
          </NavLink>
          <NavLink to="/capstone" className="nav-link">
            Capstone
          </NavLink>
          <NavLink to="/resources" className="nav-link">
            Resources
          </NavLink>
          <button
            type="button"
            className="palette-hint"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-command-palette"))
            }
            aria-label="Open command palette"
          >
            <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
            <kbd>K</kbd>
          </button>
        </nav>
      </div>
    </header>
  );
}
