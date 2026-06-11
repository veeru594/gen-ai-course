import type { ReactNode } from "react";
import "./Highlight.css";

export function Highlight({ children }: { children: ReactNode }) {
  return <mark className="hl">{children}</mark>;
}
