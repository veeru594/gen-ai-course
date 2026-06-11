import type { DemoSpec } from "../../data/types";
import "./DemoHost.css";

/**
 * Frames a demo with its title and lede. The demo registry fills the body;
 * until a demo is registered the frame renders a placeholder.
 */
import { demoRegistry } from "./registry";

export function DemoHost({ spec }: { spec: DemoSpec }) {
  const Demo = demoRegistry[spec.id];
  return (
    <section className="demo-host" aria-label={spec.title}>
      <p className="meta demo-host-tag">Interactive — try it</p>
      <h2 className="demo-host-title">{spec.title}</h2>
      <p className="demo-host-lede">{spec.lede}</p>
      <div className="demo-host-body">
        {Demo ? <Demo /> : <p className="meta">demo loading…</p>}
      </div>
    </section>
  );
}
