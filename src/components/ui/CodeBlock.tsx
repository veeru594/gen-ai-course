import { useEffect, useRef, useState } from "react";
import "./CodeBlock.css";

interface CodeBlockProps {
  code: string;
  language: string;
  label?: string;
}

export function CodeBlock({ code, language, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable (e.g. insecure context) — leave button as-is
    }
  }

  return (
    <figure className="code-block">
      <figcaption className="code-block-bar">
        <span className="code-block-label">{label ?? language}</span>
        <span className="code-block-right">
          <span className="code-block-lang">{language}</span>
          <button
            type="button"
            className="code-block-copy"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? "copied" : "copy"}
          </button>
        </span>
      </figcaption>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
