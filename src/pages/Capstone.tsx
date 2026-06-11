import "./Capstone.css";

interface Step {
  number: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "You submit your repo",
    body: "Push your capstone project to a public GitHub repository and submit the link through the Google Form. Make sure the repo is public — the pipeline cannot read private repos.",
  },
  {
    number: "02",
    title: "The pipeline reads your code",
    body: "An automated pipeline fetches your repository through the GitHub API — every source file, your README, your project structure. Nothing is executed; it is read, the way a reviewer reads.",
  },
  {
    number: "03",
    title: "Claude reviews against the rubric",
    body: "Claude evaluates your project against the course rubric — the same criteria listed below. It checks code quality, error handling, documentation, and how your AI integration is built.",
  },
  {
    number: "04",
    title: "A structured report is generated",
    body: "The review comes back in a fixed format: a Score, Strengths & Weaknesses, and concrete Improvement Suggestions. The same output-contract discipline you learned in Module 5, applied to your own work.",
  },
  {
    number: "05",
    title: "The QAE team reviews and responds",
    body: "The report lands with the Quality Assurance & Evaluation team. A human reviewer reads it alongside your code, adjusts where the AI got it wrong, and sends you the final feedback.",
  },
];

const RUBRIC: Array<{ item: string; why: string }> = [
  {
    item: "A README that explains the system",
    why: "what it does, how to run it, what each part is for — a reviewer should never have to guess",
  },
  {
    item: "Credentials kept out of the code",
    why: "keys loaded from .env, never hardcoded, never committed — this is checked first",
  },
  {
    item: "Output contracts on every AI call",
    why: "model responses validated — format, fields, types — before anything moves downstream",
  },
  {
    item: "Designing for failure",
    why: "retries on rate limits, fallbacks when the AI call fails, failed records logged rather than lost",
  },
  {
    item: "Documented AI integration points",
    why: "the prompts you used, the model you chose for each step, and why",
  },
  {
    item: "A clear commit history",
    why: "small commits with honest messages — the story of how you built it",
  },
];

export function Capstone() {
  return (
    <div className="container capstone">
      <header className="capstone-head">
        <p className="meta">CAPSTONE — 30 HRS</p>
        <h1>How your capstone is reviewed</h1>
        <p className="capstone-lede">
          Your capstone is a complete AI-automation system built from a
          requirement you have not seen before. The review process itself is an
          AI-automation pipeline — built with exactly the techniques you
          learned in this program. Here is what happens after you hit submit.
        </p>
      </header>

      <ol className="capstone-flow" aria-label="Review process, five steps">
        {STEPS.map((s) => (
          <li key={s.number} className="capstone-step">
            <span className="meta capstone-step-number">{s.number}</span>
            <h2 className="capstone-step-title">{s.title}</h2>
            <p className="capstone-step-body">{s.body}</p>
          </li>
        ))}
      </ol>

      <section className="capstone-rubric" aria-labelledby="rubric-heading">
        <h2 id="rubric-heading">What reviewers look for</h2>
        <ul className="capstone-rubric-list">
          {RUBRIC.map((r) => (
            <li key={r.item}>
              <strong>{r.item}</strong>
              <span> — {r.why}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="capstone-note" aria-label="Note on AI scoring">
        <p>
          <strong>A note on the AI score:</strong> the score Claude produces is
          advisory. Every report is read by a human reviewer on the QAE team
          before it reaches you, and the human's judgment is the one that
          counts. The AI makes the review faster and more consistent — it does
          not replace the reviewer. That is the same human-in-the-loop pattern
          you built in Module 4, and it applies to your grade too.
        </p>
      </aside>
    </div>
  );
}
