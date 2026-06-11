import type { Module } from "../../data/types";
import "./ModuleHero.css";

export function ModuleHero({ module }: { module: Module }) {
  return (
    <header className="module-hero">
      <p className="meta module-hero-meta">
        <span className="module-hero-number">MODULE {module.number}</span>
        <span className="module-hero-hours">{module.hours} HRS THEORY</span>
      </p>
      <h1 className="module-hero-title">{module.title}</h1>
      <div className="module-hero-intro">
        {module.intro.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </header>
  );
}
