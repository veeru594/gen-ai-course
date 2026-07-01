import { useEffect, useState } from "react";
import type { Explainer } from "../../data/explainers";
import "./ExplainerViewer.css";

interface ExplainerViewerProps {
  explainer: Explainer;
  onClose: () => void;
}

/**
 * Full-bleed overlay that frames a third-party interactive tool inside our own
 * chrome: breadcrumb, our guide panel, and an iframe. When the tool can't be
 * embedded (`embed: false`) we show a launch panel instead — same framing,
 * opens in a new tab.
 */
export function ExplainerViewer({ explainer, onClose }: ExplainerViewerProps) {
  const [guideOpen, setGuideOpen] = useState(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="exv-overlay"
      data-module={explainer.module}
      role="dialog"
      aria-modal="true"
      aria-label={`${explainer.title} — visual explainer`}
    >
      <header className="exv-bar">
        <div className="exv-bar-left">
          <button type="button" className="exv-close" onClick={onClose}>
            ✕ Close
          </button>
          <span className="exv-crumb meta">
            <span className="exv-crumb-concept">{explainer.concept}</span>
            <span aria-hidden="true">→</span>
            <span className="exv-crumb-title">{explainer.title}</span>
          </span>
        </div>
        <div className="exv-bar-right">
          <span className="exv-source meta">{explainer.source}</span>
          <button
            type="button"
            className="exv-toggle"
            aria-pressed={guideOpen}
            onClick={() => setGuideOpen((v) => !v)}
          >
            {guideOpen ? "Hide guide" : "Show guide"}
          </button>
          <a
            className="exv-open"
            href={explainer.url}
            target="_blank"
            rel="noreferrer"
          >
            Open original ↗
          </a>
        </div>
      </header>

      <div className={`exv-stage${guideOpen ? " has-guide" : ""}`}>
        <div className="exv-frame-wrap">
          {explainer.embed ? (
            <iframe
              className="exv-frame"
              src={explainer.url}
              title={explainer.title}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="exv-fallback">
              <p className="exv-fallback-lede">
                {explainer.title} can't be embedded directly — it opens in a new
                tab. Everything in the guide still applies.
              </p>
              <a
                className="exv-fallback-btn"
                href={explainer.url}
                target="_blank"
                rel="noreferrer"
              >
                Launch {explainer.title} ↗
              </a>
            </div>
          )}
        </div>

        {guideOpen && (
          <aside className="exv-guide" aria-label="How to use this explainer">
            <p className="exv-guide-blurb">{explainer.blurb}</p>
            <GuideList label="What you're looking at" items={explainer.guide.look} />
            <GuideList label="Try this" items={explainer.guide.try} />
          </aside>
        )}
      </div>
    </div>
  );
}

function GuideList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="exv-guide-block">
      <p className="exv-guide-label meta">{label}</p>
      <ul>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
