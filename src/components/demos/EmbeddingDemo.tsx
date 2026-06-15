import { useMemo, useState } from "react";
import { embeddingTerms, embeddingSim } from "../../data/embeddings";
import "./EmbeddingDemo.css";

const PAD = 9; // viewBox padding so edge labels stay visible
const project = (v: number) => PAD + (v / 100) * (100 - 2 * PAD);

const MODULE_LABEL: Record<string, string> = {
  foundations: "Foundations",
  automation: "Automation",
  models: "Models",
  agents: "Agents",
  python: "Python",
};

const NEIGHBOURS = 5;

export function EmbeddingDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const points = useMemo(
    () =>
      embeddingTerms.map((t) => ({
        ...t,
        px: project(t.x),
        py: project(100 - t.y),
      })),
    [],
  );

  // nearest neighbours of the selected term, by cosine similarity
  const neighbours = useMemo(() => {
    if (selected === null) {
      return [];
    }
    return embeddingSim[selected]
      .map((s, i) => ({ i, s }))
      .filter((d) => d.i !== selected)
      .sort((a, b) => b.s - a.s)
      .slice(0, NEIGHBOURS);
  }, [selected]);

  const neighbourSet = useMemo(
    () => new Set(neighbours.map((d) => d.i)),
    [neighbours],
  );

  const modulesPresent = useMemo(
    () => [...new Set(embeddingTerms.map((t) => t.module))],
    [],
  );

  return (
    <div className="emb-demo">
      <div className="emb-stage">
        <svg
          className="emb-map"
          viewBox="0 0 100 100"
          role="group"
          aria-label="Two-dimensional map of curriculum terms by semantic similarity"
        >
          {/* lines from the selected term to its nearest neighbours */}
          {selected !== null &&
            neighbours.map((d) => (
              <line
                key={`edge-${d.i}`}
                className="emb-edge"
                x1={points[selected].px}
                y1={points[selected].py}
                x2={points[d.i].px}
                y2={points[d.i].py}
                style={{ opacity: 0.25 + d.s * 0.7, strokeWidth: 0.2 + d.s * 0.9 }}
              />
            ))}

          {points.map((p, i) => {
            const isSel = i === selected;
            const isNeighbour = neighbourSet.has(i);
            const dim = selected !== null && !isSel && !isNeighbour;
            return (
              <g
                key={p.term}
                className={`emb-node${isSel ? " is-selected" : ""}${isNeighbour ? " is-neighbour" : ""}${dim ? " is-dim" : ""}`}
                data-module={p.module}
                transform={`translate(${p.px} ${p.py})`}
                tabIndex={0}
                role="button"
                aria-pressed={isSel}
                aria-label={`${p.term}, ${MODULE_LABEL[p.module]}`}
                onClick={() => setSelected(isSel ? null : i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(isSel ? null : i);
                  }
                }}
              >
                <circle className="emb-dot" r={isSel ? 2.4 : 1.7} />
                <text className="emb-label" x={2.6} y={1.2}>
                  {p.term}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="emb-side">
          {selected === null ? (
            <div className="emb-hint">
              <p className="meta emb-hint-tag">Vector space</p>
              <p>
                Every term is placed by how it's <em>used</em> in this
                curriculum — terms with similar contexts sit close together.
                <strong> Click any term</strong> to see its nearest neighbours
                by cosine similarity.
              </p>
              <ul className="emb-legend">
                {modulesPresent.map((mod) => (
                  <li key={mod} data-module={mod}>
                    <span className="emb-legend-dot" aria-hidden="true" />
                    {MODULE_LABEL[mod]}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="emb-readout" data-module={embeddingTerms[selected].module}>
              <p className="meta emb-readout-tag">Nearest to</p>
              <p className="emb-readout-term">{embeddingTerms[selected].term}</p>
              <ol className="emb-neighbours">
                {neighbours.map((d) => (
                  <li
                    key={d.i}
                    data-module={embeddingTerms[d.i].module}
                    className={hover === d.i ? "is-hover" : undefined}
                  >
                    <button type="button" onClick={() => setSelected(d.i)}>
                      <span className="emb-neighbour-term">
                        {embeddingTerms[d.i].term}
                      </span>
                      <span className="emb-neighbour-bar">
                        <span style={{ width: `${Math.max(4, d.s * 100)}%` }} />
                      </span>
                      <span className="emb-neighbour-score meta">
                        {d.s.toFixed(2)}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className="emb-clear"
                onClick={() => setSelected(null)}
              >
                clear selection
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="demo-note">
        Real embeddings have thousands of learned dimensions; this is plain
        word co-occurrence from the curriculum's own text, PPMI-weighted and
        projected to 2D. The precision is a toy — but the lesson is real:
        meaning becomes geometry, and nearby means related.
      </p>
    </div>
  );
}
