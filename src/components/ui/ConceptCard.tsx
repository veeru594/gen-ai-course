import { useState } from "react";
import type { Concept } from "../../data/types";
import "./ConceptCard.css";

export function ConceptCard({ concept }: { concept: Concept }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={`concept-card${flipped ? " is-flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${concept.term} — reveal definition`}
    >
      <span className="concept-inner">
        <span className="concept-face concept-front">
          <span className="concept-term">{concept.term}</span>
          <span className="concept-hint meta">flip</span>
        </span>
        <span className="concept-face concept-back">
          {concept.definition}
        </span>
      </span>
    </button>
  );
}
