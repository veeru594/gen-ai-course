import { useEffect, useRef, useState } from "react";
import "./WorkflowDemo.css";

interface NodeBox {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const NODES: NodeBox[] = [
  { id: "webhook", label: "Webhook", x: 10, y: 95, w: 104, h: 46 },
  { id: "validate", label: "Validate", x: 168, y: 95, w: 104, h: 46 },
  { id: "crm", label: "CRM update", x: 350, y: 22, w: 116, h: 46 },
  { id: "slack", label: "Slack alert", x: 350, y: 168, w: 116, h: 46 },
  { id: "sheet", label: "Sheet log", x: 540, y: 95, w: 104, h: 46 },
  { id: "dead", label: "Dead Letter", x: 168, y: 200, w: 104, h: 42 },
];

function center(n: NodeBox): { x: number; y: number } {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 };
}

const C = Object.fromEntries(NODES.map((n) => [n.id, center(n)]));

const EDGES: Array<[string, string]> = [
  ["webhook", "validate"],
  ["validate", "crm"],
  ["validate", "slack"],
  ["crm", "sheet"],
  ["slack", "sheet"],
  ["validate", "dead"],
];

interface Packet {
  id: string;
  x: number;
  y: number;
  err: boolean;
}

interface LogLine {
  kind: "ok" | "err" | "info";
  text: string;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function WorkflowDemo() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [log, setLog] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [broken, setBroken] = useState(false);
  const [deadLit, setDeadLit] = useState(false);
  const runId = useRef(0);

  useEffect(
    () => () => {
      runId.current += 1; // cancel any in-flight run on unmount
    },
    [],
  );

  function addLog(line: LogLine) {
    setLog((prev) => [...prev, line]);
  }

  async function run() {
    const id = ++runId.current;
    const alive = () => runId.current === id;

    setRunning(true);
    setLog([]);
    setDeadLit(false);
    setPackets([{ id: "p", ...C.webhook, err: false }]);
    addLog({ kind: "info", text: "RUN  webhook received payload" });
    await sleep(450);
    if (!alive()) return;

    setPackets([{ id: "p", ...C.validate, err: false }]);
    await sleep(650);
    if (!alive()) return;

    if (broken) {
      addLog({
        kind: "err",
        text: 'ERR  validate failed: required field "email" missing',
      });
      setPackets([{ id: "p", ...C.validate, err: true }]);
      await sleep(350);
      if (!alive()) return;
      setPackets([{ id: "p", ...C.dead, err: true }]);
      await sleep(650);
      if (!alive()) return;
      setDeadLit(true);
      addLog({
        kind: "err",
        text: "DLQ  payload routed to dead letter — preserved for review",
      });
      addLog({
        kind: "info",
        text: "END  downstream systems untouched. nothing corrupted.",
      });
      setRunning(false);
      return;
    }

    addLog({ kind: "ok", text: "OK   validate passed" });
    setPackets([
      { id: "a", ...C.validate, err: false },
      { id: "b", ...C.validate, err: false },
    ]);
    await sleep(60);
    if (!alive()) return;
    setPackets([
      { id: "a", ...C.crm, err: false },
      { id: "b", ...C.slack, err: false },
    ]);
    await sleep(650);
    if (!alive()) return;
    addLog({ kind: "ok", text: "OK   CRM record updated" });
    addLog({ kind: "ok", text: "OK   Slack alert sent to #leads" });
    setPackets([
      { id: "a", ...C.sheet, err: false },
      { id: "b", ...C.sheet, err: false },
    ]);
    await sleep(650);
    if (!alive()) return;
    addLog({ kind: "ok", text: "OK   row appended to tracking sheet" });
    addLog({ kind: "info", text: "END  run complete" });
    setPackets([]);
    setRunning(false);
  }

  return (
    <div className="workflow-demo">
      <div className="demo-controls">
        <button
          type="button"
          className="demo-btn is-primary"
          onClick={run}
          disabled={running}
        >
          {running ? "running…" : "run workflow"}
        </button>
        <label className="workflow-break">
          <input
            type="checkbox"
            checked={broken}
            onChange={(e) => setBroken(e.target.checked)}
            disabled={running}
          />
          <span>break the validate step</span>
        </label>
      </div>

      <svg
        className="workflow-canvas"
        viewBox="0 0 660 260"
        role="img"
        aria-label="Workflow diagram: webhook to validate, branching to CRM update and Slack alert, converging on sheet log, with a dead letter node for failures"
      >
        {EDGES.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={C[from].x}
            y1={C[from].y}
            x2={C[to].x}
            y2={C[to].y}
            className={
              to === "dead" ? "workflow-edge workflow-edge-dead" : "workflow-edge"
            }
          />
        ))}
        {NODES.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx={6}
              className={`workflow-node workflow-node-${n.id}${
                n.id === "dead" && deadLit ? " is-lit" : ""
              }`}
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + n.h / 2 + 4}
              textAnchor="middle"
              className="workflow-node-label"
            >
              {n.label}
            </text>
          </g>
        ))}
        {packets.map((p) => (
          <circle
            key={p.id}
            r={7}
            className={p.err ? "workflow-packet is-err" : "workflow-packet"}
            style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
          />
        ))}
      </svg>

      {log.length > 0 && (
        <div className="demo-log" role="log" aria-live="polite">
          {log.map((l, i) => (
            <div
              key={i}
              className={
                l.kind === "ok" ? "log-ok" : l.kind === "err" ? "log-err" : "log-dim"
              }
            >
              {l.text}
            </div>
          ))}
        </div>
      )}

      <p className="demo-note">
        The happy path is the easy half. Toggle the break and run again: the
        failed record routes to a dead-letter node — logged, preserved, and
        kept away from downstream systems. That is designing for failure.
      </p>
    </div>
  );
}
