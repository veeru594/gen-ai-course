import { useMemo, useState } from "react";
import "./TokenizerDemo.css";

const DEFAULT_TEXT =
  "Tokenization determines what fits in a context window, why some inputs cost more than others, and why models sometimes behave strangely at word boundaries.";

const PREFIXES = ["trans", "auto", "pre", "sub", "un", "re", "de"];
const SUFFIXES = [
  "ization",
  "ation",
  "ically",
  "ingly",
  "ness",
  "ment",
  "tion",
  "able",
  "ing",
  "ers",
  "ed",
  "ly",
  "er",
  "es",
];

/**
 * Simplified BPE-flavoured splitter: whitespace first, punctuation as its
 * own token, long words broken on common subword boundaries.
 * An approximation for intuition — real BPE differs.
 */
function tokenize(text: string): string[] {
  const tokens: string[] = [];

  function splitWord(word: string) {
    if (word.length <= 6) {
      tokens.push(word);
      return;
    }
    for (const pre of PREFIXES) {
      if (word.toLowerCase().startsWith(pre) && word.length - pre.length >= 3) {
        tokens.push(word.slice(0, pre.length));
        splitWord(word.slice(pre.length));
        return;
      }
    }
    for (const suf of SUFFIXES) {
      if (word.toLowerCase().endsWith(suf) && word.length - suf.length >= 3) {
        splitWord(word.slice(0, word.length - suf.length));
        tokens.push(word.slice(word.length - suf.length));
        return;
      }
    }
    if (word.length > 9) {
      const mid = Math.ceil(word.length / 2);
      tokens.push(word.slice(0, mid));
      splitWord(word.slice(mid));
      return;
    }
    tokens.push(word);
  }

  for (const raw of text.split(/\s+/)) {
    if (!raw) {
      continue;
    }
    // peel punctuation into its own tokens
    const m = raw.match(/^([^A-Za-z0-9]*)([A-Za-z0-9'-]*)([^A-Za-z0-9]*)$/);
    if (!m) {
      tokens.push(raw);
      continue;
    }
    const [, lead, core, trail] = m;
    for (const ch of lead) {
      tokens.push(ch);
    }
    if (core) {
      splitWord(core);
    }
    for (const ch of trail) {
      tokens.push(ch);
    }
  }
  return tokens;
}

const PRICE_PER_MTOK = 3; // sample input price, USD per million tokens

export function TokenizerDemo() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const tokens = useMemo(() => tokenize(text), [text]);
  const chars = text.replace(/\s+/g, " ").trim().length;
  const charsPerToken = tokens.length > 0 ? chars / tokens.length : 0;
  const cost = (tokens.length / 1_000_000) * PRICE_PER_MTOK;

  return (
    <div className="tokenizer-demo">
      <label className="meta" htmlFor="tokenizer-input">
        Input text
      </label>
      <textarea
        id="tokenizer-input"
        className="demo-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />

      <div className="demo-stats">
        <div className="demo-stat">
          <span className="demo-stat-value">{tokens.length}</span>
          <span className="demo-stat-label">tokens</span>
        </div>
        <div className="demo-stat">
          <span className="demo-stat-value">
            {charsPerToken ? charsPerToken.toFixed(1) : "—"}
          </span>
          <span className="demo-stat-label">~chars / token</span>
        </div>
        <div className="demo-stat">
          <span className="demo-stat-value">
            ${cost.toFixed(6)}
          </span>
          <span className="demo-stat-label">
            est. input cost @ ${PRICE_PER_MTOK}/Mtok
          </span>
        </div>
      </div>

      <div className="tokenizer-chips" aria-label="Token breakdown">
        {tokens.map((t, i) => (
          <span key={`${i}-${t}`} className={`tok tok-${i % 4}`}>
            {t}
          </span>
        ))}
      </div>

      <p className="demo-note">
        An approximation for intuition — real BPE merges learned from data and
        differs from these splits. The shape of the lesson holds: rare words
        cost more pieces.
      </p>
    </div>
  );
}
