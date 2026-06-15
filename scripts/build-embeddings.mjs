// Derives honest co-occurrence embeddings from the curriculum corpus.
// Output: src/data/embeddings.ts  (terms with 2D coords + module tag,
// a cosine-similarity matrix, and retrieval chunks for the RAG demo).
//
// Method: PPMI vectors over a context vocabulary, cosine similarity
// between curated curriculum terms, then classical MDS (via power
// iteration) to project into 2D. Real statistics, tiny scale — the
// same honesty as the n-gram model on the home page.
import fs from "node:fs";

// ---- read the corpus string out of src/data/corpus.ts ----
const corpusFile = fs.readFileSync("src/data/corpus.ts", "utf8");
const m = corpusFile.match(/corpus\s*=\s*\n?\s*"([\s\S]*?)";/);
if (!m) throw new Error("Could not extract corpus string from corpus.ts");
const corpus = m[1];
const tokens = corpus.split(/\s+/).filter(Boolean);

// ---- curated, in-curriculum vocabulary (term -> module) ----
// Only terms that genuinely appear in the corpus survive the freq filter.
const VOCAB = [
  ["token", "foundations"], ["tokenization", "foundations"], ["embeddings", "foundations"],
  ["vector", "foundations"], ["attention", "foundations"], ["transformer", "foundations"],
  ["prompt", "foundations"], ["temperature", "foundations"], ["rag", "foundations"],
  ["retrieval", "foundations"], ["chunking", "foundations"], ["hallucination", "foundations"],
  ["context", "foundations"], ["semantic", "foundations"], ["multimodal", "foundations"],
  ["reasoning", "foundations"],
  ["automation", "automation"], ["workflow", "automation"], ["webhook", "automation"],
  ["trigger", "automation"], ["make", "automation"], ["pagination", "automation"],
  ["api", "automation"], ["integration", "automation"],
  ["claude", "models"], ["gemini", "models"], ["openai", "models"],
  ["model", "models"], ["models", "models"], ["elevenlabs", "models"],
  ["agent", "agents"], ["agents", "agents"], ["langchain", "agents"],
  ["langgraph", "agents"], ["llamaindex", "agents"], ["mcp", "agents"],
  ["memory", "agents"], ["tool", "agents"], ["supervisor", "agents"],
  ["python", "python"], ["json", "python"], ["requests", "python"],
  ["streaming", "python"], ["batch", "python"], ["pipeline", "python"],
];

const STOP = new Set(
  "the a an and or of to in is are be it that this for as on with by at from not its into when how why what which they them then than so do does can will if you your we our than more most each every both very much only first second its it's a within at all any some other".split(/\s+/),
);

// ---- frequencies ----
const freq = new Map();
for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1);

// keep vocab terms that actually appear enough to be meaningful
const terms = VOCAB.filter(([t]) => (freq.get(t) || 0) >= 4);
const dropped = VOCAB.filter(([t]) => (freq.get(t) || 0) < 4).map(([t]) => t);
const termIndex = new Map(terms.map(([t], i) => [t, i]));

// ---- context vocabulary: frequent content words ----
const context = [...freq.entries()]
  .filter(([t, f]) => !STOP.has(t) && t.length > 2 && f >= 5 && /^[a-z]+$/.test(t))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 300)
  .map(([t]) => t);
const ctxIndex = new Map(context.map((t, i) => [t, i]));

// ---- co-occurrence counts within a window ----
const WINDOW = 4;
const co = terms.map(() => new Float64Array(context.length));
for (let i = 0; i < tokens.length; i++) {
  const ti = termIndex.get(tokens[i]);
  if (ti === undefined) continue;
  for (let j = Math.max(0, i - WINDOW); j <= Math.min(tokens.length - 1, i + WINDOW); j++) {
    if (j === i) continue;
    const ci = ctxIndex.get(tokens[j]);
    if (ci !== undefined) co[ti][ci] += 1;
  }
}

// ---- PPMI weighting ----
let total = 0;
const rowSum = new Float64Array(terms.length);
const colSum = new Float64Array(context.length);
for (let i = 0; i < terms.length; i++)
  for (let j = 0; j < context.length; j++) {
    const v = co[i][j];
    total += v; rowSum[i] += v; colSum[j] += v;
  }
const ppmi = terms.map(() => new Float64Array(context.length));
for (let i = 0; i < terms.length; i++)
  for (let j = 0; j < context.length; j++) {
    if (co[i][j] === 0 || rowSum[i] === 0 || colSum[j] === 0) continue;
    const p = (co[i][j] * total) / (rowSum[i] * colSum[j]);
    const val = Math.log(p);
    if (val > 0) ppmi[i][j] = val;
  }

// ---- cosine similarity matrix ----
const norm = ppmi.map((r) => Math.sqrt(r.reduce((s, v) => s + v * v, 0)) || 1);
function cosine(i, j) {
  let dot = 0;
  for (let k = 0; k < context.length; k++) dot += ppmi[i][k] * ppmi[j][k];
  return dot / (norm[i] * norm[j]);
}
const n = terms.length;
const sim = Array.from({ length: n }, (_, i) =>
  Array.from({ length: n }, (_, j) => (i === j ? 1 : cosine(i, j))),
);

// ---- classical MDS to 2D (power iteration on the centred Gram matrix) ----
const D2 = sim.map((row) => row.map((s) => Math.max(0, 2 - 2 * s)));
const rowMean = D2.map((r) => r.reduce((a, b) => a + b, 0) / n);
const grand = rowMean.reduce((a, b) => a + b, 0) / n;
const B = D2.map((r, i) => r.map((d, j) => -0.5 * (d - rowMean[i] - rowMean[j] + grand)));

function powerIter(mat) {
  let v = Array.from({ length: n }, () => Math.random());
  let lambda = 0;
  for (let iter = 0; iter < 200; iter++) {
    const nv = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) nv[i] += mat[i][j] * v[j];
    const mag = Math.sqrt(nv.reduce((s, x) => s + x * x, 0)) || 1;
    for (let i = 0; i < n; i++) nv[i] /= mag;
    lambda = mag;
    v = nv;
  }
  return { v, lambda };
}
function deflate(mat, v, lambda) {
  return mat.map((row, i) => row.map((x, j) => x - lambda * v[i] * v[j]));
}

const e1 = powerIter(B);
const e2 = powerIter(deflate(B, e1.v, e1.lambda));
const xs = e1.v.map((x) => x * Math.sqrt(Math.max(e1.lambda, 0)));
const ys = e2.v.map((y) => y * Math.sqrt(Math.max(e2.lambda, 0)));

// normalise coords to [0,100]
function normalise(arr) {
  const lo = Math.min(...arr), hi = Math.max(...arr);
  const span = hi - lo || 1;
  return arr.map((v) => Math.round(((v - lo) / span) * 1000) / 10);
}
const X = normalise(xs);
const Y = normalise(ys);

// ---- retrieval chunks (sentences) for the RAG demo ----
const sentences = corpus
  .split(/\s\.\s/)
  .map((s) => s.trim())
  .filter((s) => {
    const w = s.split(/\s+/).length;
    return w >= 9 && w <= 34;
  });
// keep sentences that touch at least two vocab terms, spread across modules, cap the count
const chunkPick = [];
const seenModules = {};
for (const s of sentences) {
  const present = [...termIndex.keys()].filter((t) =>
    new RegExp(`\\b${t}\\b`).test(s),
  );
  if (present.length < 2) continue;
  const mods = new Set(present.map((t) => terms[termIndex.get(t)][1]));
  const key = [...mods].sort().join("");
  seenModules[key] = (seenModules[key] || 0) + 1;
  if (seenModules[key] > 4) continue; // avoid over-representing one cluster
  chunkPick.push({
    text: s.charAt(0).toUpperCase() + s.slice(1) + ".",
    terms: present.map((t) => termIndex.get(t)),
  });
  if (chunkPick.length >= 28) break;
}

// ---- emit src/data/embeddings.ts ----
const round = (x) => Math.round(x * 1000) / 1000;
const out = `import type { ModuleId } from "./types";

/* Generated by scripts/build-embeddings.mjs from the curriculum corpus —
   do not edit by hand. Co-occurrence PPMI vectors, cosine similarity, and
   a classical-MDS 2D projection over ${n} curriculum terms. Real
   statistics at tiny scale; powers the Embeddings and RAG demos. */

export interface EmbTerm {
  term: string;
  module: ModuleId;
  x: number;
  y: number;
}

export const embeddingTerms: EmbTerm[] = [
${terms.map(([t, mod], i) => `  { term: ${JSON.stringify(t)}, module: ${JSON.stringify(mod)}, x: ${X[i]}, y: ${Y[i]} },`).join("\n")}
];

/** Cosine similarity matrix, aligned to embeddingTerms order. */
export const embeddingSim: number[][] = [
${sim.map((row) => `  [${row.map((v) => round(v)).join(", ")}],`).join("\n")}
];

export interface RagChunk {
  text: string;
  /** indices into embeddingTerms of the curriculum terms this chunk contains */
  terms: number[];
}

export const ragChunks: RagChunk[] = [
${chunkPick.map((c) => `  { text: ${JSON.stringify(c.text)}, terms: [${c.terms.join(", ")}] },`).join("\n")}
];
`;

fs.writeFileSync("src/data/embeddings.ts", out);
console.log(`embeddings.ts written: ${n} terms, ${chunkPick.length} chunks, ${context.length} context dims`);
if (dropped.length) console.log("dropped (too rare):", dropped.join(", "));
// quick sanity: nearest neighbours of a few terms
for (const probe of ["embeddings", "rag", "agent", "claude"]) {
  const i = termIndex.get(probe);
  if (i === undefined) continue;
  const near = sim[i]
    .map((s, j) => [terms[j][0], s])
    .filter(([, ], j) => j !== i)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([t, s]) => `${t}(${s.toFixed(2)})`);
  console.log(`  ${probe} → ${near.join(", ")}`);
}
