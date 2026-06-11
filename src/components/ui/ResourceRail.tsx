import type { Resource } from "../../data/types";
import "./ResourceRail.css";

export function ResourceRail({ resources }: { resources: Resource[] }) {
  return (
    <aside className="resource-rail" aria-label="Curated resources">
      <h2 className="meta resource-rail-title">Curated links</h2>
      <ul className="resource-rail-list">
        {resources.map((r) => (
          <li key={r.url} className="resource-rail-item">
            <a href={r.url} target="_blank" rel="noreferrer">
              {r.label}
            </a>
            <p className="resource-rail-purpose">{r.purpose}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
