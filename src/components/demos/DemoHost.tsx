import type { DemoSpec } from "../../data/types";
import { demoRegistry } from "./registry";
import "./DemoHost.css";
import "./demo-shared.css";

/** Frames a demo with its title and lede; the registry supplies the body. */
export function DemoHost({ spec }: { spec: DemoSpec }) {
  const Demo = demoRegistry[spec.id];
  return (
    <section className="demo-host" aria-label={spec.title}>
      <p className="meta demo-host-tag">Interactive — try it</p>
      <h2 className="demo-host-title">{spec.title}</h2>
      <p className="demo-host-lede">{spec.lede}</p>
      <div className="demo-host-body">
        <Demo />
      </div>
    </section>
  );
}
