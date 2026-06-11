import { useState } from "react";
import "./ContractDemo.css";

const GOOD_REPLY = `Sure! Here's the extracted invoice data you asked for:

\`\`\`json
{
  "invoice_id": "INV-2041",
  "vendor": "Acme GmbH",
  "total": 1240.5,
  "currency": "EUR",
  "due_date": "2026-07-01"
}
\`\`\`

Let me know if you need anything else!`;

const MISSING_FIELD = `Here is the invoice data:

\`\`\`json
{
  "invoice_id": "INV-2041",
  "vendor": "Acme GmbH",
  "total": 1240.5,
  "due_date": "2026-07-01"
}
\`\`\``;

const WRONG_TYPE = `Extracted successfully:

\`\`\`json
{
  "invoice_id": "INV-2041",
  "vendor": "Acme GmbH",
  "total": "1,240.50",
  "currency": "EUR",
  "due_date": "2026-07-01"
}
\`\`\``;

const TRAILING_COMMA = `\`\`\`json
{
  "invoice_id": "INV-2041",
  "vendor": "Acme GmbH",
  "total": 1240.5,
  "currency": "EUR",
  "due_date": "2026-07-01",
}
\`\`\``;

const SCHEMA: Array<{ field: string; type: "string" | "number" }> = [
  { field: "invoice_id", type: "string" },
  { field: "vendor", type: "string" },
  { field: "total", type: "number" },
  { field: "currency", type: "string" },
  { field: "due_date", type: "string" },
];

type StageStatus = "pass" | "fail" | "skip";

interface StageResult {
  name: string;
  status: StageStatus;
  detail: string;
}

function runPipeline(raw: string): { stages: StageResult[]; pass: boolean } {
  const stages: StageResult[] = [];

  // stage 1: strip fences and prose
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  let candidate = fence?.[1]?.trim();
  if (!candidate) {
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first !== -1 && last > first) {
      candidate = raw.slice(first, last + 1);
    }
  }
  if (!candidate) {
    stages.push({
      name: "strip fences",
      status: "fail",
      detail: "no JSON object found in the reply — nothing to parse",
    });
    stages.push({ name: "parse JSON", status: "skip", detail: "skipped" });
    stages.push({ name: "schema check", status: "skip", detail: "skipped" });
    return { stages, pass: false };
  }
  stages.push({
    name: "strip fences",
    status: "pass",
    detail: fence
      ? "markdown fence found — extracted inner JSON, discarded prose"
      : "no fence — extracted outermost { … } block",
  });

  // stage 2: parse
  let parsed: unknown;
  try {
    parsed = JSON.parse(candidate);
  } catch (e) {
    stages.push({
      name: "parse JSON",
      status: "fail",
      detail: e instanceof Error ? e.message : "parse error",
    });
    stages.push({ name: "schema check", status: "skip", detail: "skipped" });
    return { stages, pass: false };
  }
  stages.push({ name: "parse JSON", status: "pass", detail: "valid JSON" });

  // stage 3: schema
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    stages.push({
      name: "schema check",
      status: "fail",
      detail: "top level is not an object",
    });
    return { stages, pass: false };
  }
  const obj = parsed as Record<string, unknown>;
  for (const { field, type } of SCHEMA) {
    if (!(field in obj)) {
      stages.push({
        name: "schema check",
        status: "fail",
        detail: `required field "${field}" missing`,
      });
      return { stages, pass: false };
    }
    if (typeof obj[field] !== type) {
      stages.push({
        name: "schema check",
        status: "fail",
        detail: `field "${field}": expected ${type}, got ${typeof obj[field]} (${JSON.stringify(obj[field])})`,
      });
      return { stages, pass: false };
    }
  }
  stages.push({
    name: "schema check",
    status: "pass",
    detail: "all 5 required fields present with correct types",
  });
  return { stages, pass: true };
}

const VARIANTS = [
  { label: "reset to original", text: GOOD_REPLY },
  { label: "load: missing field", text: MISSING_FIELD },
  { label: "load: wrong type", text: WRONG_TYPE },
  { label: "load: trailing comma", text: TRAILING_COMMA },
];

export function ContractDemo() {
  const [text, setText] = useState(GOOD_REPLY);
  const [result, setResult] = useState<ReturnType<typeof runPipeline> | null>(
    null,
  );

  return (
    <div className="contract-demo">
      <label className="meta" htmlFor="contract-input">
        raw model reply
      </label>
      <textarea
        id="contract-input"
        className="demo-textarea contract-textarea"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setResult(null);
        }}
        spellCheck={false}
      />

      <div className="demo-controls">
        <button
          type="button"
          className="demo-btn is-primary"
          onClick={() => setResult(runPipeline(text))}
        >
          validate
        </button>
        {VARIANTS.map((v) => (
          <button
            key={v.label}
            type="button"
            className="demo-btn"
            onClick={() => {
              setText(v.text);
              setResult(null);
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="contract-stages" aria-live="polite">
          {result.stages.map((s) => (
            <div key={s.name} className={`contract-stage stage-${s.status}`}>
              <span className="contract-stage-status">
                {s.status === "pass" ? "OK" : s.status === "fail" ? "FAIL" : "—"}
              </span>
              <span className="contract-stage-name">{s.name}</span>
              <span className="contract-stage-detail">{s.detail}</span>
            </div>
          ))}
          <div
            className={`contract-result ${result.pass ? "is-pass" : "is-fail"}`}
          >
            {result.pass
              ? "PASS — safe to hand downstream"
              : "FAIL — stopped before it corrupted a downstream system"}
          </div>
        </div>
      )}

      <p className="demo-note">
        Every failure above is one your workflow will meet in production. The
        contract — strip, parse, check — is what stands between a chatty model
        reply and a broken automation at 3 a.m.
      </p>
    </div>
  );
}
