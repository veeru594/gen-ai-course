import { Link } from "react-router-dom";
import { modules } from "../data/modules";
import { DemoHost } from "../components/demos/DemoHost";
import "./Playground.css";

export function Playground() {
  const entries = modules.flatMap((m) =>
    m.demos.map((spec) => ({ module: m, spec })),
  );

  return (
    <div className="container playground">
      <header className="playground-head">
        <h1>Playground</h1>
        <p>
          All six teaching demos on one page. Each one is pure client-side code
          — no API keys, no network calls — built to make one idea from the
          curriculum impossible to forget. The module pages embed them where
          they teach best; here they are in one room.
        </p>
      </header>

      {entries.map(({ module, spec }) => (
        <article
          key={spec.id}
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
    </div>
  );
}
