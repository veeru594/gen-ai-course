import { NavLink, Link } from "react-router-dom";
import { DrfLogo } from "./DrfLogo";
import "./Header.css";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <div className="site-header-brand">
          <a
            className="site-header-logo"
            href="https://www.drreddysfoundation.org/"
            target="_blank"
            rel="noreferrer"
            aria-label="Dr. Reddy's Foundation"
          >
            <DrfLogo />
          </a>
          <span className="site-header-divider" aria-hidden="true" />
          <Link to="/" className="brand">
            <span className="brand-name">Automation with Generative AI</span>
          </Link>
        </div>
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
        </nav>
      </div>
    </header>
  );
}
