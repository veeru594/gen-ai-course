import { useMemo, useState } from "react";
import { embeddingTerms, embeddingSim, ragChunks } from "../../data/embeddings";
import "./RagDemo.css";

const PRESETS = [
  "How do I stop the model making things up?",
  "What controls the randomness of the output?",
  "How do agents remember things across steps?",
  "How does retrieval find relevant text?",
];

const TOP_K = 3;
const N = embeddingTerms.length;

/** Match query words to curriculum terms (exact or shared stem). */
function matchTerms(query: string): number[] {
  const words = query.toLowerCase().match(/[a-z]+/g) ?? [];
  const hits = new Set<number>();
  for (const w of words) {
    if (w.length < 3) {
      continue;
    }
    embeddingTerms.forEach((t, i) => {
      if (t.term === w || t.term.startsWith(w) || w.startsWith(t.term)) {
        hits.add(i);
      }
    });
  }
  return [...hits];
}

export function RagDemo() {
  const [query, setQuery] = useState(PRESETS[0]);

  const result = useMemo(() => {
    const matched = matchTerms(query);

    // soft query vector: every term gets a weight = its best similarity to a
    // matched query term (matched terms themselves weight 1). This is what
    // makes retrieval semantic rather than keyword — it reuses the embeddings.
    const weight = new Array<number>(N).fill(0);
    for (const mt of matched) {
      weight[mt] = 1;
    }
    for (const mt of matched) {
      for (let t = 0; t < N; t++) {
        weight[t] = Math.max(weight[t], embeddingSim[mt][t]);
      }
    }

    const scored = ragChunks
      .map((c, idx) => {
        const raw = c.terms.reduce((s, ci) => s + weight[ci], 0);
        return { idx, chunk: c, score: raw / Math.sqrt(c.terms.length || 1) };
      })
      .sort((a, b) => b.score - a.score);

    // expansion terms surfaced for the "understood as" stage
    const expansion = weight
      .map((w, i) => ({ i, w }))
      .filter((d) => d.w > 0.15 && !matched.includes(d.i))
      .sort((a, b) => b.w - a.w)
      .slice(0, 4);

    return { matched, expansion, scored, max: scored[0]?.score || 1 };
  }, [query]);

  const retrieved = result.scored.slice(0, TOP_K).filter((s) => s.score > 0);
  const hasMatch = result.matched.length > 0;

  return (
    <div className="rag-demo">
      <div className="rag-ask">
        <input
          className="rag-input"
          type="text"
          value={query}
          aria-label="Ask a question of the curriculum"
          placeholder="Ask a question…"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="rag-presets">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={`rag-preset${p === query ? " is-on" : ""}`}
            onClick={() => setQuery(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stage 1 — understand the query via embeddings */}
      <div className="rag-stage">
        <p className="meta rag-stage-tag">1 · Embed the query</p>
        {hasMatch ? (
          <p className="rag-terms">
            {result.matched.map((i) => (
              <span
                key={`m-${i}`}
                className="rag-term is-match"
                data-module={embeddingTerms[i].module}
              >
                {embeddingTerms[i].term}
              </span>
            ))}
            {result.expansion.length > 0 && (
              <>
                <span className="rag-arrow" aria-hidden="true">
                   + similar
                </span>
                {result.expansion.map((d) => (
                  <span
                    key={`e-${d.i}`}
                    className="rag-term is-expand"
                    data-module={embeddingTerms[d.i].module}
                    title={`cosine ${d.w.toFixed(2)}`}
                  >
                    {embeddingTerms[d.i].term}
                  </span>
                ))}
              </>
            )}
          </p>
        ) : (
          <p className="rag-empty">
            No curriculum terms recognised — try one of the questions above.
          </p>
        )}
      </div>

      {/* Stage 2 — retrieve by similarity */}
      <div className="rag-stage">
        <p className="meta rag-stage-tag">2 · Retrieve by similarity</p>
        <ol className="rag-chunks">
          {result.scored.slice(0, 6).map((s, rank) => {
            const isHit = rank < TOP_K && s.score > 0 && hasMatch;
            return (
              <li
                key={s.idx}
                className={`rag-chunk${isHit ? " is-hit" : ""}`}
              >
                <span className="rag-chunk-score meta">
                  {s.score > 0 ? s.score.toFixed(2) : "—"}
                </span>
                <span className="rag-chunk-bar" aria-hidden="true">
                  <span
                    style={{
                      width: `${result.max ? Math.max(2, (s.score / result.max) * 100) : 2}%`,
                    }}
                  />
                </span>
                <span className="rag-chunk-text">{s.chunk.text}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Stage 3 — augment the prompt */}
      <div className="rag-stage">
        <p className="meta rag-stage-tag">3 · Augment the prompt</p>
        {hasMatch && retrieved.length > 0 ? (
          <pre className="rag-prompt">
            <span className="rag-prompt-sys">
              System: Answer using only the context below. If the context
              doesn't cover it, say so.
            </span>
            {"\n\nContext:\n"}
            {retrieved.map((s, i) => (
              <span key={s.idx} className="rag-prompt-ctx">
                {`  [${i + 1}] ${s.chunk.text}\n`}
              </span>
            ))}
            {"\nQuestion: "}
            <span className="rag-prompt-q">{query}</span>
          </pre>
        ) : (
          <p className="rag-empty">Nothing retrieved — no prompt to build.</p>
        )}
      </div>

      <p className="demo-note">
        Retrieval here is genuine: chunks are cosine-ranked against the query
        using the same curriculum embeddings as the map above — so it matches
        meaning, not just shared words. The one step not running is the last
        one: in production an LLM writes the final answer from exactly this
        augmented prompt. That's RAG — the model answers from retrieved context
        instead of its memory.
      </p>
    </div>
  );
}
