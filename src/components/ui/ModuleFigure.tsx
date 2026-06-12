import type { ModuleId } from "../../data/types";
import foundationsImg from "../../assets/modules/foundations.jpg";
import automationImg from "../../assets/modules/automation.jpg";
import modelsImg from "../../assets/modules/models.jpg";
import agentsImg from "../../assets/modules/agents.jpg";
import pythonImg from "../../assets/modules/python.jpg";
import "./ModuleFigure.css";

interface Figure {
  src: string;
  alt: string;
  caption: string;
}

export const moduleFigures: Record<ModuleId, Figure> = {
  foundations: {
    src: foundationsImg,
    alt: "Sketch of a transformer machine: token blocks labelled auto, ma, tion feed into a multi-head self-attention unit, and a single predicted next-token block comes out the other side",
    caption:
      "tokens in, one predicted token out — the whole machine exists for the next token.",
  },
  automation: {
    src: automationImg,
    alt: "Sketch of a workflow pipeline: a webhook unit feeds a validate unit, which branches to CRM and chat-alert units that converge on a spreadsheet unit; below the validate step, a dashed arrow drops into a dead-letter bin",
    caption:
      "the happy path, the branch — and the dead-letter bin that saves you at 3 a.m.",
  },
  models: {
    src: modelsImg,
    alt: "Sketch of three engine machines on a bench — small, balanced, large — each with fit, cost, and speed gauges; the balanced one is circled and marked best for this task",
    caption:
      "three engines, one bench. read the gauges per task — not the spec sheet.",
  },
  agents: {
    src: agentsImg,
    alt: "Sketch of four machines in a loop — perceive, think, act, observe — connected by arrows, with an escape arrow leading to a stop sign labelled max iterations",
    caption:
      "perceive, think, act, observe — and the stop sign that ends runaway loops.",
  },
  python: {
    src: pythonImg,
    alt: "Sketch of a rugged terminal running a Python script, with three cables plugging into cloud shapes labelled CRM API, Marketing API, and Billing API; one cable carries a padlock",
    caption: "one script, three APIs — and the credentials stay on the padlock.",
  },
};

export function ModuleFigure({ moduleId }: { moduleId: ModuleId }) {
  const fig = moduleFigures[moduleId];
  return (
    <figure className="module-figure">
      <img src={fig.src} alt={fig.alt} loading="lazy" />
      <figcaption className="meta module-figure-caption">
        fig — {fig.caption}
      </figcaption>
    </figure>
  );
}
