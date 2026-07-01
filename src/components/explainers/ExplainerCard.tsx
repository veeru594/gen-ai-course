import type { Explainer } from "../../data/explainers";
import "./ExplainerCard.css";

interface ExplainerCardProps {
  explainer: Explainer;
  onOpen: (explainer: Explainer) => void;
}

export function ExplainerCard({ explainer, onOpen }: ExplainerCardProps) {
  return (
    <button
      type="button"
      className="ex-card"
      data-module={explainer.module}
      onClick={() => onOpen(explainer)}
    >
      <span className="ex-card-concept meta">{explainer.concept}</span>
      <span className="ex-card-title">{explainer.title}</span>
      <span className="ex-card-blurb">{explainer.blurb}</span>
      <span className="ex-card-foot">
        <span className="ex-card-source meta">{explainer.source}</span>
        <span className="ex-card-cue" aria-hidden="true">
          ▶ explore
        </span>
      </span>
    </button>
  );
}
